import {
  CHESS_USERNAME,
  CLASH_API_TOKEN,
  CLASH_PLAYER_TAG,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
  CACHE_TTL,
} from "./config";

// Cache configuration
const cache = new Map();

// Helper function to create fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

// Generic cache helper
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const fetchChessStats = async () => {
  const cacheKey = `chess-${CHESS_USERNAME}`;

  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Fetch player stats with timeout
    const statsResponse = await fetchWithTimeout(
      `https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`,
      {
        headers: {
          "User-Agent":
            "willhao.com Chess Stats Widget (https://willhao.com; william.hao.55@gmail.com) Node.js/fetch",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site",
          Referer: "https://willhao.com/",
        },
      },
      8000, // 8 second timeout
    );

    if (!statsResponse.ok) {
      throw new Error(`Chess API error: ${statsResponse.status}`);
    }

    const statsData = await statsResponse.json();

    // Calculate total games
    const totalGames =
      (statsData.chess_rapid?.last?.games_played || 0) +
      (statsData.chess_blitz?.last?.games_played || 0) +
      (statsData.chess_bullet?.last?.games_played || 0) +
      (statsData.chess_daily?.last?.games_played || 0);

    const formattedStats = {
      rapid: {
        rating: statsData.chess_rapid?.last?.rating,
        games: statsData.chess_rapid?.last?.games_played || 0,
      },
      blitz: {
        rating: statsData.chess_blitz?.last?.rating,
        games: statsData.chess_blitz?.last?.games_played || 0,
      },
      bullet: {
        rating: statsData.chess_bullet?.last?.rating,
        games: statsData.chess_bullet?.last?.games_played || 0,
      },
      puzzles: {
        rating: statsData.tactics?.highest?.rating,
        total: statsData.tactics?.highest?.total_attempts || 0,
      },
      totalGames,
    };

    // Cache the successful result
    setCachedData(cacheKey, formattedStats);
    return formattedStats;
  } catch (error) {
    console.error("Error fetching chess stats:", error);
    // Return default values if fetch fails - do not cache error responses
    return {
      rapid: { rating: null, games: 0 },
      blitz: { rating: null, games: 0 },
      bullet: { rating: null, games: 0 },
      puzzles: { rating: null, total: 0 },
      totalGames: 0,
    };
  }
};

export const fetchClashPlayer = async () => {
  if (!CLASH_API_TOKEN || !CLASH_PLAYER_TAG) {
    console.warn("Clash of Clans API token or player tag not configured");
    return {
      name: "Player",
      townHallLevel: null,
      trophies: null,
      bestTrophies: null,
      league: null,
    };
  }

  const cacheKey = `clash-${CLASH_PLAYER_TAG}`;

  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetchWithTimeout(
      `https://api.clashofclans.com/v1/players/%23${CLASH_PLAYER_TAG}`,
      {
        headers: {
          Authorization: `Bearer ${CLASH_API_TOKEN}`,
          Accept: "application/json",
        },
      },
      8000, // 8 second timeout
    );

    if (!response.ok) {
      throw new Error(`Clash API error: ${response.status}`);
    }

    const playerData = await response.json();

    const formattedPlayer = {
      name: playerData.name,
      tag: playerData.tag,
      townHallLevel: playerData.townHallLevel,
      trophies: playerData.trophies,
      bestTrophies: playerData.bestTrophies,
      league: playerData.league
        ? {
            name: playerData.league.name,
            iconUrls: playerData.league.iconUrls,
          }
        : null,
      clan: playerData.clan
        ? {
            name: playerData.clan.name,
            tag: playerData.clan.tag,
          }
        : null,
      role: playerData.role,
      warStars: playerData.warStars,
      attackWins: playerData.attackWins,
      defenseWins: playerData.defenseWins,
      builderHallLevel: playerData.builderHallLevel || null,
      versusTrophies: playerData.versusTrophies || null,
      bestVersusTrophies: playerData.bestVersusTrophies || null,
    };

    // Cache the successful result
    setCachedData(cacheKey, formattedPlayer);
    return formattedPlayer;
  } catch (error) {
    console.error("Error fetching clash player:", error);
    // Return default values if fetch fails - do not cache error responses
    return {
      name: "Player",
      townHallLevel: null,
      trophies: null,
      bestTrophies: null,
      league: null,
    };
  }
};

export const fetchSpotifyStats = async () => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    console.warn("Spotify API credentials not configured");
    return {
      isPlaying: false,
      trackName: null,
      artistName: null,
      albumName: null,
      trackUrl: null,
      albumArt: null,
      lastPlayed: null,
    };
  }

  const cacheKey = "spotify-stats";
  const SPOTIFY_CACHE_TTL = 5 * 1000; // 5 seconds cache for real-time

  // Check cache first with shorter TTL for Spotify
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SPOTIFY_CACHE_TTL) {
    return cached.data;
  }

  try {
    // Get access token using refresh token
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
      8000,
    );

    if (!tokenResponse.ok) {
      throw new Error(`Spotify token error: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get currently playing track
    const currentResponse = await fetchWithTimeout(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      8000,
    );

    if (currentResponse.status === 204 || !currentResponse.ok) {
      // No track currently playing, get recently played
      const recentResponse = await fetchWithTimeout(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        8000,
      );

      if (!recentResponse.ok) {
        throw new Error(`Spotify recent error: ${recentResponse.status}`);
      }

      const recentData = await recentResponse.json();

      if (recentData.items && recentData.items.length > 0) {
        const track = recentData.items[0].track;
        const formattedData = {
          isPlaying: false,
          trackName: track.name,
          artistName: track.artists.map((artist) => artist.name).join(", "),
          albumName: track.album.name,
          trackUrl: track.external_urls.spotify,
          albumArt: track.album.images[0]?.url || null,
          lastPlayed: recentData.items[0].played_at,
        };

        // Use custom cache setting for Spotify
        cache.set(cacheKey, {
          data: formattedData,
          timestamp: Date.now(),
        });
        return formattedData;
      }
    } else {
      // Currently playing
      const currentData = await currentResponse.json();

      if (currentData.item) {
        const track = currentData.item;
        const formattedData = {
          isPlaying: currentData.is_playing,
          trackName: track.name,
          artistName: track.artists.map((artist) => artist.name).join(", "),
          albumName: track.album.name,
          trackUrl: track.external_urls.spotify,
          albumArt: track.album.images[0]?.url || null,
          lastPlayed: null,
        };

        // Use custom cache setting for Spotify
        cache.set(cacheKey, {
          data: formattedData,
          timestamp: Date.now(),
        });
        return formattedData;
      }
    }

    // Fallback if no data
    const defaultData = {
      isPlaying: false,
      trackName: null,
      artistName: null,
      albumName: null,
      trackUrl: null,
      albumArt: null,
      lastPlayed: null,
    };

    // Use custom cache setting for Spotify
    cache.set(cacheKey, {
      data: defaultData,
      timestamp: Date.now(),
    });
    return defaultData;
  } catch (error) {
    console.error("Error fetching Spotify stats:", error);
    // Return default values if fetch fails - do not cache error responses
    return {
      isPlaying: false,
      trackName: null,
      artistName: null,
      albumName: null,
      trackUrl: null,
      albumArt: null,
      lastPlayed: null,
    };
  }
};
