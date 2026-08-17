// Type definition for the data we return to the UI components
export interface SpotifyData {
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  lastPlayed?: string; // Optional - only when not currently playing
  backoff?: boolean; // Optional - set while an upstream fetch is failing
}

// Internal types matching Spotify API response structure
interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
}

interface SpotifyEpisode {
  name: string;
  show: { name: string };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  currently_playing_type: string;
  item: SpotifyTrack | SpotifyEpisode;
}

// Store access token in memory to avoid unnecessary refresh calls
let cachedToken: { token: string; expires: number } | null = null;

// Store rotated refresh token in memory (falls back to env var)
let rotatedRefreshToken: string | null = null;

// Store fetched data in memory for instant retrieval
// Fresh TTL stays just above the tick - dev HMR can detach the ticker.
// Idle recently-played calls are throttled - 2s polling exhausted that
// endpoint's daily quota (429 QUOTA_EXCEEDED)
const CACHE_DURATION = 3 * 1000;
const STALE_DURATION = 5 * 60 * 1000;
const IDLE_HISTORY_INTERVAL = 60 * 1000;
const REFRESH_INTERVAL = 2 * 1000;

// playedAt keeps the raw timestamp so lastPlayed is formatted at read time
// and stays accurate however old the entry is
let cachedStats: {
  data: SpotifyData;
  playedAt: number | null;
  fetchedAt: number;
} | null = null;

// Rebuild the wire object - lastPlayed and backoff are computed at read time
function buildData(entry: {
  data: SpotifyData;
  playedAt: number | null;
}): SpotifyData {
  const result: SpotifyData = {
    isPlaying: entry.data.isPlaying,
    songTitle: entry.data.songTitle,
    artist: entry.data.artist,
  };
  if (entry.playedAt !== null) {
    result.lastPlayed = formatTimeSince(entry.playedAt);
  } else if (entry.data.lastPlayed) {
    result.lastPlayed = entry.data.lastPlayed;
  }
  // recentFailing only taints history-derived entries, not live player data
  if (
    currentFailing ||
    (recentFailing &&
      !entry.data.isPlaying &&
      entry.data.lastPlayed !== "(paused)")
  ) {
    result.backoff = true;
  }
  return result;
}

// Get cached data if available and not expired
export function getCachedSpotifyData(): SpotifyData | null {
  if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_DURATION) {
    return buildData(cachedStats);
  }
  return null;
}

// Backoff gates: backoffUntil covers token + currently-playing,
// recentBackoffUntil covers recently-played (its quota exhausts alone).
// A dead refresh token (400) is only fixable by re-auth, so gate long
const NON_429_BACKOFF = 5 * 1000;
const RATE_LIMIT_BACKOFF = 30 * 1000;
const MAX_RETRY_AFTER = 60 * 60 * 1000;
const DEAD_TOKEN_BACKOFF = 60 * 60 * 1000;
let backoffUntil = 0;
let recentBackoffUntil = 0;

// Failure state drives the widget's backoff flag - gates only pace retries
let currentFailing = false;
let recentFailing = false;

// QUOTA_EXCEEDED bans run hours - honor Retry-After (capped at 1h; each
// probe re-reads a fresh value, so longer bans still hold)
async function rateLimitWait(response: Response): Promise<number> {
  if (response.status !== 429) {
    return 0;
  }
  const retryAfter = response.headers.get("Retry-After");
  let reason = "";
  try {
    const body = await response.json();
    if (body && body.error && body.error.reason) {
      reason = body.error.reason;
    }
  } catch {
    // 429 body absent or not JSON - the header alone decides
  }
  console.error(
    "Spotify 429, Retry-After: " + retryAfter + ", reason: " + reason,
  );
  let waitMs = RATE_LIMIT_BACKOFF;
  if (reason === "QUOTA_EXCEEDED") {
    waitMs = MAX_RETRY_AFTER;
  }
  const seconds = Number(retryAfter);
  if (seconds > 0) {
    waitMs = seconds * 1000;
  }
  if (waitMs > MAX_RETRY_AFTER) {
    waitMs = MAX_RETRY_AFTER;
  }
  return waitMs;
}

// Background refresh to keep cache warm
let backgroundRefreshStarted = false;

export function startBackgroundRefresh() {
  if (backgroundRefreshStarted) return;
  backgroundRefreshStarted = true;

  setInterval(function refreshCache() {
    if (Date.now() < backoffUntil) return;
    startFetch().catch(function handleError(error) {
      console.error("Spotify background refresh error:", error);
    });
  }, REFRESH_INTERVAL);
}

// Helper function to get/refresh Spotify access token
async function getAccessToken(
  signal: AbortSignal | null = null,
): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  // Get credentials from environment variables
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = rotatedRefreshToken || process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials");
  }

  // Exchange refresh token for new access token using Spotify OAuth
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    signal: signal,
  });

  if (!response.ok) {
    let wait = await rateLimitWait(response);
    if (wait === 0) {
      // Brief gate so a non-429 failure isn't retried every tick
      wait = NON_429_BACKOFF;
    }
    // 400 means the refresh token itself is dead (revoked, or past
    // Spotify's 6-month expiry) - only re-auth + a restart can fix it
    if (response.status === 400) {
      wait = DEAD_TOKEN_BACKOFF;
    }
    backoffUntil = Date.now() + wait;
    throw new Error("Token refresh failed: " + response.status);
  }

  const data = await response.json();

  // Cache the new token with expiration time
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  // Store rotated refresh token if Spotify issued a new one
  if (data.refresh_token) {
    rotatedRefreshToken = data.refresh_token;
  }

  return data.access_token;
}

// Extract artist names from a Spotify track
function getArtistNames(track: SpotifyTrack): string {
  const names = [];
  const artists = track.artists || [];
  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    if (!artist) continue;
    names.push(artist.name);
  }
  return names.join(", ");
}

// Helper to format time difference as human-readable string
function formatTimeSince(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays > 0) {
    return diffDays + "d ago";
  }
  if (diffHours > 0) {
    return diffHours + "h ago";
  }
  if (diffMins > 0) {
    return diffMins + "m ago";
  }
  return "just now";
}

// When recently-played was last actually queried (any status)
let lastRecentlyPlayedAt = 0;

// Last tick where Spotify reported is_playing - anchors demotion times,
// since a track can sit paused for hours before its session dies
let lastConfirmedPlayingAt = 0;

// Serve the cached entry (marked checked-now) or give up with an error
function serveCachedOrThrow(message: string): SpotifyData {
  if (cachedStats) {
    cachedStats.fetchedAt = Date.now();
    return buildData(cachedStats);
  }
  throw new Error(message);
}

// Fetch the most recently played track from Spotify's history API
async function fetchRecentlyPlayed(
  accessToken: string,
  controller: AbortController,
): Promise<SpotifyData> {
  if (Date.now() < recentBackoffUntil) {
    return serveCachedOrThrow("Spotify recently-played backoff active");
  }

  // Stamp before the request - a thrown attempt (timeout, network) must
  // consume the idle throttle window too, or it retries every tick
  lastRecentlyPlayedAt = Date.now();

  let response: Response;
  try {
    response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );
  } catch (error) {
    recentBackoffUntil = Date.now() + NON_429_BACKOFF;
    recentFailing = true;
    throw error;
  }

  if (!response.ok) {
    let wait = await rateLimitWait(response);
    if (wait === 0) {
      // Brief gate so a non-429 failure isn't retried every tick
      wait = NON_429_BACKOFF;
      console.error("Spotify recently-played returned " + response.status);
    }
    recentBackoffUntil = Date.now() + wait;
    recentFailing = true;
    return serveCachedOrThrow(
      "Spotify recently-played returned " + response.status,
    );
  }

  let recent: { items: { track: SpotifyTrack; played_at: string }[] };
  try {
    recent = await response.json();
  } catch (error) {
    recentBackoffUntil = Date.now() + NON_429_BACKOFF;
    recentFailing = true;
    throw error;
  }
  recentFailing = false;

  if (recent.items && recent.items.length > 0) {
    const item = recent.items[0];
    if (item) {
      let playedAt = new Date(item.played_at).getTime();
      // A malformed played_at would cache NaN and render "just now" forever
      if (!Number.isFinite(playedAt)) {
        playedAt = Date.now();
      }
      const entry = {
        data: {
          isPlaying: false,
          songTitle: item.track.name,
          artist: getArtistNames(item.track),
        },
        playedAt: playedAt,
        fetchedAt: Date.now(),
      };
      cachedStats = entry;
      return buildData(entry);
    }
  }

  // Spotify intermittently returns an empty 200 for accounts with history
  // (known API bug) - keep the cached entry over a sudden "no history"
  if (cachedStats) {
    console.error("Spotify recently-played returned 200 with no items");
    cachedStats.fetchedAt = Date.now();
    return buildData(cachedStats);
  }

  const empty: SpotifyData = {
    isPlaying: false,
    songTitle: "Nothing played yet",
    artist: "—",
  };
  cachedStats = { data: empty, playedAt: null, fetchedAt: Date.now() };
  return empty;
}

// Single-flight guard so concurrent cache misses share one upstream request
let inFlightFetch: Promise<SpotifyData> | null = null;

// Always fetches (bypasses the TTL check) - used by the background refresh
async function startFetch(): Promise<SpotifyData> {
  if (inFlightFetch) {
    return inFlightFetch;
  }

  const fetchPromise = fetchFreshSpotifyData();
  inFlightFetch = fetchPromise;
  try {
    return await fetchPromise;
  } finally {
    inFlightFetch = null;
  }
}

// Cache-first read used by the API route and instrumentation warm-up
export async function fetchSpotifyData(): Promise<SpotifyData> {
  if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_DURATION) {
    return buildData(cachedStats);
  }
  try {
    return await startFetch();
  } catch (error) {
    // An expired playing/paused claim demotes to last-played instead of
    // dropping, so outages that start mid-playback keep the track
    if (
      cachedStats &&
      cachedStats.playedAt === null &&
      Date.now() - cachedStats.fetchedAt >= STALE_DURATION &&
      (cachedStats.data.isPlaying || cachedStats.data.lastPlayed === "(paused)")
    ) {
      let playedAt = cachedStats.fetchedAt;
      if (lastConfirmedPlayingAt > 0) {
        playedAt = lastConfirmedPlayingAt;
      }
      cachedStats = {
        data: {
          isPlaying: false,
          songTitle: cachedStats.data.songTitle,
          artist: cachedStats.data.artist,
        },
        playedAt: playedAt,
        fetchedAt: cachedStats.fetchedAt,
      };
    }
    // Serve last-known-good through upstream failures - last-played
    // entries indefinitely (marked checked-now so the SSR reader agrees),
    // playing/paused claims only within the window
    if (cachedStats && cachedStats.playedAt !== null) {
      cachedStats.fetchedAt = Date.now();
      return buildData(cachedStats);
    }
    if (cachedStats && Date.now() - cachedStats.fetchedAt < STALE_DURATION) {
      return buildData(cachedStats);
    }
    throw error;
  }
}

// Fetch fresh playing status from the Spotify API and update the cache
async function fetchFreshSpotifyData(): Promise<SpotifyData> {
  if (Date.now() < backoffUntil) {
    throw new Error("Spotify backoff active, skipping fetch");
  }

  // Set up timeout handling (5 second limit)
  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

  // History-phase errors are recentFailing's job - the flag scopes the
  // catch so they don't taint the live currently-playing state
  let historyPhase = false;

  try {
    let accessToken = await getAccessToken(controller.signal);

    // Try to get currently playing track
    let currentResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );

    // Handle expired token - clear cache and get fresh token
    if (currentResponse.status === 401) {
      cachedToken = null;
      accessToken = await getAccessToken(controller.signal);
      currentResponse = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          signal: controller.signal,
          cache: "no-store",
        },
      );
    }

    // Errors throw - callers fall back to the cached entry
    if (!currentResponse.ok) {
      let wait = await rateLimitWait(currentResponse);
      if (wait === 0) {
        // Brief gate so a non-429 failure isn't retried every tick
        wait = NON_429_BACKOFF;
      }
      backoffUntil = Date.now() + wait;
      currentFailing = true;
      // With no cache at all, a healthy history endpoint still beats a
      // 503 - the pre-throttle code always had this fallback (throttled,
      // so a dual cold-start outage cannot spin the history endpoint)
      if (
        !cachedStats &&
        Date.now() - lastRecentlyPlayedAt >= IDLE_HISTORY_INTERVAL
      ) {
        historyPhase = true;
        return await fetchRecentlyPlayed(accessToken, controller);
      }
      throw new Error(
        "Spotify currently-playing returned " + currentResponse.status,
      );
    }
    currentFailing = false;

    // Parse response if we got valid data (not 204 No Content)
    if (currentResponse.status !== 204) {
      const current: SpotifyCurrentlyPlaying = await currentResponse.json();

      // Skip ads and unknown types
      if (
        current.item &&
        current.currently_playing_type !== "ad" &&
        current.currently_playing_type !== "unknown"
      ) {
        let artistName = "";
        if (current.currently_playing_type === "episode") {
          const episode = current.item as SpotifyEpisode;
          if (episode.show) {
            artistName = episode.show.name;
          } else {
            artistName = "Podcast";
          }
        } else {
          artistName = getArtistNames(current.item as SpotifyTrack);
        }

        const result: SpotifyData = {
          isPlaying: current.is_playing,
          songTitle: current.item.name,
          artist: artistName,
        };
        if (current.is_playing) {
          lastConfirmedPlayingAt = Date.now();
        } else {
          result.lastPlayed = "(paused)";
        }
        cachedStats = { data: result, playedAt: null, fetchedAt: Date.now() };
        return result;
      }
    }

    historyPhase = true;

    // Playback stopped - demote a lingering playing/paused entry so it
    // survives as last-played even if the history call fails
    if (
      cachedStats &&
      cachedStats.playedAt === null &&
      (cachedStats.data.isPlaying || cachedStats.data.lastPlayed === "(paused)")
    ) {
      let playedAt = Date.now();
      if (lastConfirmedPlayingAt > 0) {
        playedAt = lastConfirmedPlayingAt;
      }
      cachedStats = {
        data: {
          isPlaying: false,
          songTitle: cachedStats.data.songTitle,
          artist: cachedStats.data.artist,
        },
        playedAt: playedAt,
        fetchedAt: Date.now(),
      };
    }

    // While idle the last-played track cannot change, so throttle the
    // recently-played call - its quota is what the 2s cadence exhausted.
    // The gate holds with or without a cache, or cold starts spin
    if (Date.now() - lastRecentlyPlayedAt < IDLE_HISTORY_INTERVAL) {
      if (cachedStats) {
        cachedStats.fetchedAt = Date.now();
        return buildData(cachedStats);
      }
      throw new Error("Spotify recently-played throttled with no cache");
    }

    return await fetchRecentlyPlayed(accessToken, controller);
  } catch (error) {
    if (!historyPhase) {
      currentFailing = true;
      // Thrown failures (timeout, network) need pacing too - extend only,
      // never shorten a longer gate set upstream
      const gate = Date.now() + NON_429_BACKOFF;
      if (gate > backoffUntil) {
        backoffUntil = gate;
      }
    }
    // Handle timeout vs other errors differently
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Spotify API timeout after 5 seconds");
      throw new Error("Spotify API request timed out");
    }
    console.error("Spotify API error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
