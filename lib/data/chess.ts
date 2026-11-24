export interface ChessStats {
  rapid: number | null;
  blitz: number | null;
  bullet: number | null;
}

const CHESS_USERNAME = "javablob";
// Keep the TTL above the refresh interval
const CACHE_DURATION = 150 * 1000;
const REFRESH_INTERVAL = 60 * 1000;

let cachedStats: { data: ChessStats; expires: number } | null = null;

export function getCachedChessStats(): ChessStats | null {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return null;
}

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

let inFlightFetch: Promise<ChessStats> | null = null;

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

export async function fetchChessStats(): Promise<ChessStats> {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return startFetch();
}

async function fetchFreshChessStats(): Promise<ChessStats> {
  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

  try {
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

    let rapidRating = null;
    if (
      data.chess_rapid &&
      data.chess_rapid.last &&
      data.chess_rapid.last.rating !== null &&
      data.chess_rapid.last.rating !== undefined
    ) {
      rapidRating = data.chess_rapid.last.rating;
    }

    let blitzRating = null;
    if (
      data.chess_blitz &&
      data.chess_blitz.last &&
      data.chess_blitz.last.rating !== null &&
      data.chess_blitz.last.rating !== undefined
    ) {
      blitzRating = data.chess_blitz.last.rating;
    }

    let bulletRating = null;
    if (
      data.chess_bullet &&
      data.chess_bullet.last &&
      data.chess_bullet.last.rating !== null &&
      data.chess_bullet.last.rating !== undefined
    ) {
      bulletRating = data.chess_bullet.last.rating;
    }

    const stats = {
      rapid: rapidRating,
      blitz: blitzRating,
      bullet: bulletRating,
    };

    cachedStats = {
      data: stats,
      expires: Date.now() + CACHE_DURATION,
    };

    return stats;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Chess.com API timeout after 5 seconds");
      throw new Error("Chess.com API request timed out");
    }
    console.error("Chess.com API error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
