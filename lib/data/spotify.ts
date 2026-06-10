// Type definition for the data we return to the UI components
export interface SpotifyData {
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  lastPlayed?: string; // Optional - only when not currently playing
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
// TTL stays just above the tick - dev HMR can detach the ticker
const CACHE_DURATION = 3 * 1000;
const REFRESH_INTERVAL = 2 * 1000;

let cachedStats: { data: SpotifyData; expires: number } | null = null;

// Get cached data if available and not expired
export function getCachedSpotifyData(): SpotifyData | null {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return null;
}

// Background refresh to keep cache warm
let backgroundRefreshStarted = false;

export function startBackgroundRefresh() {
  if (backgroundRefreshStarted) return;
  backgroundRefreshStarted = true;

  setInterval(function refreshCache() {
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

// Fetch the most recently played track from Spotify's history API
async function fetchRecentlyPlayed(
  accessToken: string,
  controller: AbortController,
): Promise<SpotifyData> {
  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      signal: controller.signal,
      cache: "no-store",
    },
  );

  if (response.ok) {
    const recent: { items: { track: SpotifyTrack; played_at: string }[] } =
      await response.json();

    if (recent.items && recent.items.length > 0) {
      const track = recent.items[0];
      if (track) {
        return {
          isPlaying: false,
          songTitle: track.track.name,
          artist: getArtistNames(track.track),
          lastPlayed: formatTimeSince(new Date(track.played_at).getTime()),
        };
      }
    }
  }

  return {
    isPlaying: false,
    songTitle: "Nothing played yet",
    artist: "—",
  };
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
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return startFetch();
}

// Fetch fresh playing status from the Spotify API and update the cache
async function fetchFreshSpotifyData(): Promise<SpotifyData> {
  // Set up timeout handling (5 second limit)
  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

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

    // Parse response if we got valid data (not 204 No Content)
    if (currentResponse.ok && currentResponse.status !== 204) {
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
        if (!current.is_playing) {
          result.lastPlayed = "(paused)";
        }
        cachedStats = { data: result, expires: Date.now() + CACHE_DURATION };
        return result;
      }
    }

    // Not actively playing - fetch last played track from recently-played API
    const recentResult = await fetchRecentlyPlayed(accessToken, controller);
    cachedStats = { data: recentResult, expires: Date.now() + CACHE_DURATION };
    return recentResult;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Spotify API timeout after 5 seconds");
    } else {
      console.error("Spotify API error:", error);
    }

    return {
      isPlaying: false,
      songTitle: "—",
      artist: "—",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
