export interface SpotifyData {
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  songUrl?: string; // Its page on Spotify
  lastPlayed?: string; // Only when not playing
  backoff?: boolean; // Upstream is failing
}

// Spotify API response types
interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  external_urls?: { spotify?: string };
}

interface SpotifyEpisode {
  name: string;
  show: { name: string };
  external_urls?: { spotify?: string };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  currently_playing_type: string;
  item: SpotifyTrack | SpotifyEpisode;
}

let cachedToken: { token: string; expires: number } | null = null;

let rotatedRefreshToken: string | null = null;

const CACHE_DURATION = 3 * 1000;
const STALE_DURATION = 5 * 60 * 1000;
const IDLE_HISTORY_INTERVAL = 60 * 1000; // 2s polling hit 429 QUOTA_EXCEEDED
const REFRESH_INTERVAL = 2 * 1000;

let cachedStats: {
  data: SpotifyData;
  playedAt: number | null;
  fetchedAt: number;
} | null = null;

function buildData(entry: {
  data: SpotifyData;
  playedAt: number | null;
}): SpotifyData {
  const result: SpotifyData = {
    isPlaying: entry.data.isPlaying,
    songTitle: entry.data.songTitle,
    artist: entry.data.artist,
  };
  if (entry.data.songUrl) {
    result.songUrl = entry.data.songUrl;
  }
  if (entry.playedAt !== null) {
    result.lastPlayed = formatTimeSince(entry.playedAt);
  } else if (entry.data.lastPlayed) {
    result.lastPlayed = entry.data.lastPlayed;
  }
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

export function getCachedSpotifyData(): SpotifyData | null {
  if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_DURATION) {
    return buildData(cachedStats);
  }
  return null;
}

const NON_429_BACKOFF = 5 * 1000;
const RATE_LIMIT_BACKOFF = 30 * 1000;
const MAX_RETRY_AFTER = 60 * 60 * 1000;
const DEAD_TOKEN_BACKOFF = 60 * 60 * 1000;
let backoffUntil = 0;
let recentBackoffUntil = 0; // recently-played has its own quota

let currentFailing = false;
let recentFailing = false;

// Honor Retry-After, capped at 1h
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
    // No JSON body
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

async function getAccessToken(
  signal: AbortSignal | null = null,
): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = rotatedRefreshToken || process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials");
  }

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
      wait = NON_429_BACKOFF;
    }
    // 400 = dead refresh token - run npm run spotify-auth
    if (response.status === 400) {
      wait = DEAD_TOKEN_BACKOFF;
    }
    backoffUntil = Date.now() + wait;
    throw new Error("Token refresh failed: " + response.status);
  }

  const data = await response.json();

  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  if (data.refresh_token) {
    rotatedRefreshToken = data.refresh_token;
  }

  return data.access_token;
}

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

// Local files have no page
function getSongUrl(item: SpotifyTrack | SpotifyEpisode): string | null {
  if (!item.external_urls) return null;
  const url = item.external_urls.spotify;
  if (typeof url === "string" && url.startsWith("https://open.spotify.com/")) {
    return url;
  }
  return null;
}

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

let lastRecentlyPlayedAt = 0;

let lastConfirmedPlayingAt = 0;

function serveCachedOrThrow(message: string): SpotifyData {
  if (cachedStats) {
    cachedStats.fetchedAt = Date.now();
    return buildData(cachedStats);
  }
  throw new Error(message);
}

async function fetchRecentlyPlayed(
  accessToken: string,
  controller: AbortController,
): Promise<SpotifyData> {
  if (Date.now() < recentBackoffUntil) {
    return serveCachedOrThrow("Spotify recently-played backoff active");
  }

  // Stamp first so failed attempts count too
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
      if (!Number.isFinite(playedAt)) {
        playedAt = Date.now();
      }
      const data: SpotifyData = {
        isPlaying: false,
        songTitle: item.track.name,
        artist: getArtistNames(item.track),
      };
      const songUrl = getSongUrl(item.track);
      if (songUrl) {
        data.songUrl = songUrl;
      }
      const entry = {
        data: data,
        playedAt: playedAt,
        fetchedAt: Date.now(),
      };
      cachedStats = entry;
      return buildData(entry);
    }
  }

  // Spotify sometimes sends an empty 200 - keep the cache
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

let inFlightFetch: Promise<SpotifyData> | null = null;

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

export async function fetchSpotifyData(): Promise<SpotifyData> {
  if (cachedStats && Date.now() - cachedStats.fetchedAt < CACHE_DURATION) {
    return buildData(cachedStats);
  }
  try {
    return await startFetch();
  } catch (error) {
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
      const demoted: SpotifyData = {
        isPlaying: false,
        songTitle: cachedStats.data.songTitle,
        artist: cachedStats.data.artist,
      };
      if (cachedStats.data.songUrl) {
        demoted.songUrl = cachedStats.data.songUrl;
      }
      cachedStats = {
        data: demoted,
        playedAt: playedAt,
        fetchedAt: cachedStats.fetchedAt,
      };
    }
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

async function fetchFreshSpotifyData(): Promise<SpotifyData> {
  if (Date.now() < backoffUntil) {
    throw new Error("Spotify backoff active, skipping fetch");
  }

  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

  let historyPhase = false;

  try {
    let accessToken = await getAccessToken(controller.signal);

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

    if (!currentResponse.ok) {
      let wait = await rateLimitWait(currentResponse);
      if (wait === 0) {
        wait = NON_429_BACKOFF;
      }
      backoffUntil = Date.now() + wait;
      currentFailing = true;
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

    // 204 = nothing playing
    if (currentResponse.status !== 204) {
      const current: SpotifyCurrentlyPlaying = await currentResponse.json();

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
        const songUrl = getSongUrl(current.item);
        if (songUrl) {
          result.songUrl = songUrl;
        }
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

    if (
      cachedStats &&
      cachedStats.playedAt === null &&
      (cachedStats.data.isPlaying || cachedStats.data.lastPlayed === "(paused)")
    ) {
      let playedAt = Date.now();
      if (lastConfirmedPlayingAt > 0) {
        playedAt = lastConfirmedPlayingAt;
      }
      const demoted: SpotifyData = {
        isPlaying: false,
        songTitle: cachedStats.data.songTitle,
        artist: cachedStats.data.artist,
      };
      if (cachedStats.data.songUrl) {
        demoted.songUrl = cachedStats.data.songUrl;
      }
      cachedStats = {
        data: demoted,
        playedAt: playedAt,
        fetchedAt: Date.now(),
      };
    }

    // Idle - throttle history
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
      const gate = Date.now() + NON_429_BACKOFF;
      if (gate > backoffUntil) {
        backoffUntil = gate;
      }
    }
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
