// Type definition for the chess ratings we return to UI components
export interface ChessStats {
  rapid: number | null;
  blitz: number | null;
  bullet: number | null;
}

// Configuration constants
const CHESS_USERNAME = "javablob";
// Cache TTL outlives the refresh interval so a failed background refresh
// serves stale data instead of an empty cache
const CACHE_DURATION = 150 * 1000;
const REFRESH_INTERVAL = 60 * 1000;

let cachedStats: { data: ChessStats; expires: number } | null = null;

// Get cached data if available and not expired
export function getCachedChessStats(): ChessStats | null {
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
      console.error("Chess background refresh error:", error);
    });
  }, REFRESH_INTERVAL);
}

// Single-flight guard so concurrent cache misses share one upstream request
let inFlightFetch: Promise<ChessStats> | null = null;

// Always fetches (bypasses the TTL check) - used by the background refresh
async function startFetch(): Promise<ChessStats> {
  if (inFlightFetch) {
    return inFlightFetch;
  }

  const fetchPromise = fetchFreshChessStats();
  inFlightFetch = fetchPromise;
  try {
    return await fetchPromise;
  } finally {
    inFlightFetch = null;
  }
}

// Cache-first read used by the API route and instrumentation warm-up
export async function fetchChessStats(): Promise<ChessStats> {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return startFetch();
}

// Fetch fresh ratings from the Chess.com API and update the cache
async function fetchFreshChessStats(): Promise<ChessStats> {
  // Set up timeout handling (5 second limit)
  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

  try {
    // Fetch player statistics from Chess.com API
    const response = await fetch(
      "https://api.chess.com/pub/player/" + CHESS_USERNAME + "/stats",
      {
        headers: {
          "User-Agent": "willhao.com (william.hao.55@gmail.com)",
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Chess.com API returned " + response.status);
    }

    const data = await response.json();

    // Extract rapid rating from API response
    let rapidRating = null;
    if (
      data.chess_rapid &&
      data.chess_rapid.last &&
      data.chess_rapid.last.rating !== null &&
      data.chess_rapid.last.rating !== undefined
    ) {
      rapidRating = data.chess_rapid.last.rating;
    }

    // Extract blitz rating from API response
    let blitzRating = null;
    if (
      data.chess_blitz &&
      data.chess_blitz.last &&
      data.chess_blitz.last.rating !== null &&
      data.chess_blitz.last.rating !== undefined
    ) {
      blitzRating = data.chess_blitz.last.rating;
    }

    // Extract bullet rating from API response
    let bulletRating = null;
    if (
      data.chess_bullet &&
      data.chess_bullet.last &&
      data.chess_bullet.last.rating !== null &&
      data.chess_bullet.last.rating !== undefined
    ) {
      bulletRating = data.chess_bullet.last.rating;
    }

    // Construct the return object with all ratings
    const stats = {
      rapid: rapidRating,
      blitz: blitzRating,
      bullet: bulletRating,
    };

    // Cache the stats
    cachedStats = {
      data: stats,
      expires: Date.now() + CACHE_DURATION,
    };

    return stats;
  } catch (error) {
    // Handle timeout vs other errors differently
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Chess.com API timeout after 5 seconds");
      throw new Error("Chess.com API request timed out");
    }
    console.error("Chess.com API error:", error);
    throw error;
  } finally {
    // Always clean up the timeout
    clearTimeout(timeoutId);
  }
}
