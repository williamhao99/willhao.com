import {
  CHESS_USERNAME,
  CLASH_API_TOKEN,
  CLASH_PLAYER_TAG,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} from "./config.server";

// Configuration constants
const TIMEOUTS = {
  DEFAULT_REQUEST: 10000, // 10 seconds
  API_REQUEST: 8000,      // 8 seconds for external APIs
};

// Cache durations for different APIs (easily adjustable)
const CACHE_DURATIONS = {
  SPOTIFY: 5 * 1000,        // 5 seconds - live music updates
  CHESS: 5 * 60 * 1000,     // 5 minutes - doesn't change often
  CLASH: 5 * 60 * 1000,     // 5 minutes
};

// In-memory cache storage
const dataCache = new Map();

// Fetch with timeout protection
const fetchWithTimeout = async (url, options = {}, timeoutMs = TIMEOUTS.DEFAULT_REQUEST) => {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: abortController.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

// Check if cached data is still fresh
const getCachedData = (cacheKey, cacheDuration) => {
  const cachedEntry = dataCache.get(cacheKey);
  if (cachedEntry && Date.now() - cachedEntry.timestamp < cacheDuration) {
    return cachedEntry.data;
  }
  return null;
};

// Store data in cache with timestamp
const setCachedData = (cacheKey, data) => {
  dataCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

// Generic cache-first data fetcher
const fetchWithCache = async (cacheKey, fetchFunction, fallbackData, customCacheDuration) => {
  // Try cache first
  const cachedData = getCachedData(cacheKey, customCacheDuration);
  if (cachedData) {
    return cachedData;
  }

  try {
    const freshData = await fetchFunction();
    setCachedData(cacheKey, freshData);
    return freshData;
  } catch (error) {
    console.error(`API fetch failed for ${cacheKey}:`, error);
    return fallbackData; // Return safe defaults without caching
  }
};

// Calculate total games across all chess time controls
const calculateTotalChessGames = (statsData) => {
  const gameTypes = ['chess_rapid', 'chess_blitz', 'chess_bullet', 'chess_daily'];
  return gameTypes.reduce((total, gameType) => {
    return total + (statsData[gameType]?.last?.games_played || 0);
  }, 0);
};

// Format raw Chess.com API data into our standard structure
const formatChessStats = (rawStatsData) => {
  const totalGames = calculateTotalChessGames(rawStatsData);

  return {
    rapid: {
      rating: rawStatsData.chess_rapid?.last?.rating,
      games: rawStatsData.chess_rapid?.last?.games_played || 0,
    },
    blitz: {
      rating: rawStatsData.chess_blitz?.last?.rating,
      games: rawStatsData.chess_blitz?.last?.games_played || 0,
    },
    bullet: {
      rating: rawStatsData.chess_bullet?.last?.rating,
      games: rawStatsData.chess_bullet?.last?.games_played || 0,
    },
    puzzles: {
      rating: rawStatsData.tactics?.highest?.rating,
      total: rawStatsData.tactics?.highest?.total_attempts || 0,
    },
    totalGames,
  };
};

// Get Chess.com player statistics with caching
export const fetchChessStats = async () => {
  const cacheKey = `chess-${CHESS_USERNAME}`;

  const defaultChessStats = {
    rapid: { rating: null, games: 0 },
    blitz: { rating: null, games: 0 },
    bullet: { rating: null, games: 0 },
    puzzles: { rating: null, total: 0 },
    totalGames: 0,
  };

  return fetchWithCache(cacheKey, async () => {
    const apiResponse = await fetchWithTimeout(
      `https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`,
      {
        headers: {
          "User-Agent": "willhao.com widgets (+https://willhao.com)",
          Accept: "application/json",
        },
      },
      TIMEOUTS.API_REQUEST,
    );

    if (!apiResponse.ok) {
      throw new Error(`Chess API returned status: ${apiResponse.status}`);
    }

    const rawStatsData = await apiResponse.json();
    return formatChessStats(rawStatsData);
  }, defaultChessStats, CACHE_DURATIONS.CHESS);
};

// Check if we have the required Clash of Clans credentials
const hasClashCredentials = () => {
  return Boolean(CLASH_API_TOKEN && CLASH_PLAYER_TAG);
};

// Format raw Clash of Clans API data into our standard structure
const formatClashPlayerData = (rawPlayerData) => {
  return {
    name: rawPlayerData.name,
    tag: rawPlayerData.tag,
    townHallLevel: rawPlayerData.townHallLevel,
    trophies: rawPlayerData.trophies,
    bestTrophies: rawPlayerData.bestTrophies,
    league: rawPlayerData.league
      ? {
          name: rawPlayerData.league.name,
          iconUrls: rawPlayerData.league.iconUrls,
        }
      : null,
    clan: rawPlayerData.clan
      ? {
          name: rawPlayerData.clan.name,
          tag: rawPlayerData.clan.tag,
        }
      : null,
    role: rawPlayerData.role,
    warStars: rawPlayerData.warStars,
    attackWins: rawPlayerData.attackWins,
    defenseWins: rawPlayerData.defenseWins,
    builderHallLevel: rawPlayerData.builderHallLevel || null,
    versusTrophies: rawPlayerData.versusTrophies || null,
    bestVersusTrophies: rawPlayerData.bestVersusTrophies || null,
  };
};

// Get Clash of Clans player data with caching
export const fetchClashPlayer = async () => {
  const defaultPlayerData = {
    name: "Player",
    townHallLevel: null,
    trophies: null,
    bestTrophies: null,
    league: null,
  };

  // Return defaults if credentials are missing
  if (!hasClashCredentials()) {
    console.warn("Clash of Clans API credentials not configured");
    return defaultPlayerData;
  }

  const cacheKey = `clash-${CLASH_PLAYER_TAG}`;

  return fetchWithCache(cacheKey, async () => {
    const apiResponse = await fetchWithTimeout(
      `https://api.clashofclans.com/v1/players/%23${CLASH_PLAYER_TAG}`,
      {
        headers: {
          Authorization: `Bearer ${CLASH_API_TOKEN}`,
          Accept: "application/json",
        },
      },
      TIMEOUTS.API_REQUEST,
    );

    if (!apiResponse.ok) {
      throw new Error(`Clash API returned status: ${apiResponse.status}`);
    }

    const rawPlayerData = await apiResponse.json();
    return formatClashPlayerData(rawPlayerData);
  }, defaultPlayerData, CACHE_DURATIONS.CLASH);
};

// Check if we have all required Spotify credentials
const hasSpotifyCredentials = () => {
  return Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REFRESH_TOKEN);
};

// Get a fresh Spotify access token using our refresh token
const refreshSpotifyAccessToken = async () => {
  const tokenResponse = await fetchWithTimeout(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    },
    TIMEOUTS.API_REQUEST,
  );

  if (!tokenResponse.ok) {
    throw new Error(`Spotify token refresh failed: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
};

// Format track data into our standard structure
const formatTrackData = (track, isCurrentlyPlaying = false, playedAt = null) => {
  return {
    isPlaying: isCurrentlyPlaying,
    trackName: track.name,
    artistName: track.artists.map((artist) => artist.name).join(", "),
    albumName: track.album.name,
    trackUrl: track.external_urls.spotify,
    albumArt: track.album.images[0]?.url || null,
    lastPlayed: playedAt,
  };
};

// Get currently playing track from Spotify
const getCurrentlyPlayingTrack = async (accessToken) => {
  const currentResponse = await fetchWithTimeout(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    TIMEOUTS.API_REQUEST,
  );

  // Return null if no track is currently playing or API error
  if (currentResponse.status === 204 || !currentResponse.ok) {
    return null;
  }

  const currentData = await currentResponse.json();
  if (!currentData.item) {
    return null;
  }

  return formatTrackData(currentData.item, currentData.is_playing);
};

// Get most recently played track from Spotify
const getRecentlyPlayedTrack = async (accessToken) => {
  const recentResponse = await fetchWithTimeout(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    TIMEOUTS.API_REQUEST,
  );

  if (!recentResponse.ok) {
    throw new Error(`Spotify recent tracks failed: ${recentResponse.status}`);
  }

  const recentData = await recentResponse.json();
  if (!recentData.items || recentData.items.length === 0) {
    return null;
  }

  const recentTrack = recentData.items[0];
  return formatTrackData(recentTrack.track, false, recentTrack.played_at);
};

// Get current or recent Spotify track with OAuth token refresh
export const fetchSpotifyStats = async () => {
  const defaultTrackData = {
    isPlaying: false,
    trackName: null,
    artistName: null,
    albumName: null,
    trackUrl: null,
    albumArt: null,
    lastPlayed: null,
  };

  // Return defaults if credentials are missing
  if (!hasSpotifyCredentials()) {
    console.warn("Spotify API credentials not configured");
    return defaultTrackData;
  }

  const cacheKey = "spotify-stats";

  return fetchWithCache(cacheKey, async () => {
    // Get fresh access token
    const accessToken = await refreshSpotifyAccessToken();

    // Try to get currently playing track first
    const currentTrack = await getCurrentlyPlayingTrack(accessToken);
    if (currentTrack) {
      return currentTrack;
    }

    // Fall back to recently played track
    const recentTrack = await getRecentlyPlayedTrack(accessToken);
    if (recentTrack) {
      return recentTrack;
    }

    // If no tracks found, return defaults
    return defaultTrackData;
  }, defaultTrackData, CACHE_DURATIONS.SPOTIFY);
};
