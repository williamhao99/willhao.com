export interface SpotifyData {
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  songUrl?: string; // Its page on Spotify
  lastPlayed?: string; // Only when not playing
  backoff?: boolean; // Upstream is failing
}

// Spotify API response types
interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
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

const STALE_DURATION = 5 * 60 * 1000;
const IDLE_HISTORY_INTERVAL = 60 * 1000; // 2s polling hit 429 QUOTA_EXCEEDED

let cachedStats: {
  data: SpotifyData;
  playedAt: number | null;
  fetchedAt: number;
} | null = null;

// Last-played entries at any age; playing/paused for 5 min, then last played
export function getCachedSpotifyData(): SpotifyData | null {
  if (!cachedStats) return null;
  const result = { ...cachedStats.data };
  let current = result.isPlaying || result.lastPlayed === "(paused)";
  let playedAt = cachedStats.playedAt;
  if (current && Date.now() - cachedStats.fetchedAt >= STALE_DURATION) {
    current = false;
    result.isPlaying = false;
    playedAt = lastConfirmedPlayingAt || cachedStats.fetchedAt;
  }
  if (playedAt !== null) {
    result.lastPlayed = formatTimeSince(playedAt);
  }
  if (currentFailing || (recentFailing && !current)) {
    result.backoff = true;
  }
  return result;
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
async function failureWait(response: Response): Promise<number> {
  if (response.status !== 429) {
    return NON_429_BACKOFF;
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
  return Math.min(waitMs, MAX_RETRY_AFTER);
}

async function getAccessToken(signal: AbortSignal): Promise<string> {
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
    let wait = await failureWait(response);
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

async function fetchRecentlyPlayed(
  accessToken: string,
  signal: AbortSignal,
): Promise<void> {
  if (Date.now() < recentBackoffUntil) return;

  // Stamp first so failed attempts count too
  lastRecentlyPlayedAt = Date.now();

  let recent: { items: { track: SpotifyTrack; played_at: string }[] };
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        signal: signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const wait = await failureWait(response);
      recentBackoffUntil = Date.now() + wait;
      throw new Error("Spotify recently-played returned " + response.status);
    }

    recent = await response.json();
  } catch (error) {
    recentFailing = true;
    throw error;
  }
  recentFailing = false;

  const item = recent.items && recent.items[0];
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
    cachedStats = { data: data, playedAt: playedAt, fetchedAt: Date.now() };
  } else if (cachedStats) {
    // Spotify sometimes sends an empty 200 - keep the cache
    console.error("Spotify recently-played returned 200 with no items");
  } else {
    cachedStats = {
      data: { isPlaying: false, songTitle: "Nothing played yet", artist: "—" },
      playedAt: null,
      fetchedAt: Date.now(),
    };
  }
}

let fetching = false;

export async function fetchSpotifyData(): Promise<void> {
  if (fetching || Date.now() < backoffUntil) return;
  fetching = true;

  const signal = AbortSignal.timeout(5000);
  let historyPhase = false;

  try {
    let accessToken = await getAccessToken(signal);

    let currentResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        signal: signal,
        cache: "no-store",
      },
    );

    if (currentResponse.status === 401) {
      cachedToken = null;
      accessToken = await getAccessToken(signal);
      currentResponse = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          signal: signal,
          cache: "no-store",
        },
      );
    }

    if (!currentResponse.ok) {
      const wait = await failureWait(currentResponse);
      backoffUntil = Date.now() + wait;
      currentFailing = true;
      if (
        !cachedStats &&
        Date.now() - lastRecentlyPlayedAt >= IDLE_HISTORY_INTERVAL
      ) {
        historyPhase = true;
        await fetchRecentlyPlayed(accessToken, signal);
        return;
      }
      throw new Error(
        "Spotify currently-playing returned " + currentResponse.status,
      );
    }

    // 204 = nothing playing
    if (currentResponse.status !== 204) {
      const current: SpotifyCurrentlyPlaying = await currentResponse.json();
      currentFailing = false;

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
        return;
      }
    }

    currentFailing = false;
    historyPhase = true;

    if (
      cachedStats &&
      (cachedStats.data.isPlaying || cachedStats.data.lastPlayed === "(paused)")
    ) {
      cachedStats.data = { ...cachedStats.data, isPlaying: false };
      delete cachedStats.data.lastPlayed;
      cachedStats.playedAt = lastConfirmedPlayingAt || cachedStats.fetchedAt;
    }

    // Idle - throttle history
    if (Date.now() - lastRecentlyPlayedAt < IDLE_HISTORY_INTERVAL) return;

    await fetchRecentlyPlayed(accessToken, signal);
  } catch (error) {
    if (!historyPhase) {
      currentFailing = true;
      backoffUntil = Math.max(backoffUntil, Date.now() + NON_429_BACKOFF);
    }
    console.error("Spotify API error:", error);
  } finally {
    fetching = false;
  }
}
