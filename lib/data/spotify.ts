// Type definition for the data we return to the UI components
export interface SpotifyData {
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  lastPlayed?: string; // Optional - only for recently played tracks
}

// Internal types matching Spotify API response structure
interface SpotifyArtist {
  name: string;
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[]; // Multiple artists
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack;
}

interface SpotifyRecentItem {
  track: SpotifyTrack;
  played_at: string; // ISO timestamp of when track was played
}

// Store access token in memory to avoid unnecessary refresh calls
let cachedToken: { token: string; expires: number } | null = null;

// Store fetched data in memory for instant retrieval
let cachedData: { data: SpotifyData; timestamp: number } | null = null;
const DATA_CACHE_DURATION = 3 * 1000; // 3 seconds

// Get cached data if available and not expired
export function getCachedSpotifyData(): SpotifyData | null {
  if (cachedData && Date.now() - cachedData.timestamp < DATA_CACHE_DURATION) {
    return cachedData.data;
  }
  return null;
}

// Background refresh to keep cache warm
let backgroundRefreshStarted = false;

export function startBackgroundRefresh() {
  if (backgroundRefreshStarted) return;
  backgroundRefreshStarted = true;

  setInterval(function refreshCache() {
    fetchSpotifyData().catch(function handleError(error) {
      console.error("Spotify background refresh error:", error);
    });
  }, 3000);
}

// Helper function to get/refresh Spotify access token
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  // Get credentials from environment variables
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

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
        Buffer.from(clientId + ":" + clientSecret).toString("base64"), // Base64 encode credentials
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed: " + response.status);
  }

  const data = await response.json();

  // Cache the new token with expiration time
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000, // Use actual expiry minus 1min buffer
  };

  return data.access_token;
}

// Main function that fetches current Spotify playing status
export async function fetchSpotifyData(): Promise<SpotifyData> {
  // Return cached data if still valid
  if (cachedData && Date.now() - cachedData.timestamp < DATA_CACHE_DURATION) {
    return cachedData.data;
  }

  // Set up timeout handling (5 second limit)
  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

  try {
    let accessToken = await getAccessToken();

    // First, try to get currently playing track
    let currentResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
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
      accessToken = await getAccessToken();
      currentResponse = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
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
      if (current.item) {
        // Return currently playing track info
        const artistNames = [];
        for (let i = 0; i < current.item.artists.length; i++) {
          const artist = current.item.artists[i];
          if (!artist) continue;
          artistNames.push(artist.name);
        }
        const result: SpotifyData = {
          isPlaying: current.is_playing,
          songTitle: current.item.name,
          artist: artistNames.join(", "),
        };
        cachedData = { data: result, timestamp: Date.now() };
        return result;
      }
    }

    // If nothing is currently playing, fall back to recently played tracks
    let recentResponse = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (recentResponse.status === 401) {
      cachedToken = null;
      accessToken = await getAccessToken();
      recentResponse = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
          signal: controller.signal,
          cache: "no-store",
        },
      );
    }

    if (!recentResponse.ok) {
      throw new Error("Spotify API error: " + recentResponse.status);
    }

    const recent: { items: SpotifyRecentItem[] } = await recentResponse.json();

    // Extract first (most recent) track from the array
    let track = null;
    if (recent.items && recent.items.length > 0) {
      track = recent.items[0];
    }

    if (!track) {
      throw new Error("No Spotify data available");
    }

    // Calculate how long ago the track was played
    const diffMs = Date.now() - new Date(track.played_at).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Format time as human-readable string
    let lastPlayed = "just now";
    if (diffDays > 0) lastPlayed = diffDays + "d ago";
    else if (diffHours > 0) lastPlayed = diffHours + "h ago";
    else if (diffMins > 0) lastPlayed = diffMins + "m ago";

    // Return recently played track info with relative timestamp
    const artistNames = [];
    for (let i = 0; i < track.track.artists.length; i++) {
      const artist = track.track.artists[i];
      if (!artist) continue;
      artistNames.push(artist.name);
    }
    const result: SpotifyData = {
      isPlaying: false,
      songTitle: track.track.name,
      artist: artistNames.join(", "),
      lastPlayed,
    };
    cachedData = { data: result, timestamp: Date.now() };
    return result;
  } catch (error) {
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
