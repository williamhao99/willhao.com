// Type definition for the chess ratings we return to UI components
export interface ChessStats {
  rapid: number | null;
  blitz: number | null;
  bullet: number | null;
}

// Configuration constants
const CHESS_USERNAME = "javablob";
const CACHE_DURATION = 5 * 1000; // 5 seconds

let cachedStats: { data: ChessStats; expires: number } | null = null;

// Main function that fetches chess ratings from Chess.com
export async function fetchChessStats(): Promise<ChessStats> {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }

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
      data.chess_rapid.last.rating
    ) {
      rapidRating = data.chess_rapid.last.rating;
    }

    // Extract blitz rating from API response
    let blitzRating = null;
    if (
      data.chess_blitz &&
      data.chess_blitz.last &&
      data.chess_blitz.last.rating
    ) {
      blitzRating = data.chess_blitz.last.rating;
    }

    // Extract bullet rating from API response
    let bulletRating = null;
    if (
      data.chess_bullet &&
      data.chess_bullet.last &&
      data.chess_bullet.last.rating
    ) {
      bulletRating = data.chess_bullet.last.rating;
    }

    // Construct the return object with all ratings
    const stats = {
      rapid: rapidRating,
      blitz: blitzRating,
      bullet: bulletRating,
    };

    // Cache the stats for 5 minutes
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
