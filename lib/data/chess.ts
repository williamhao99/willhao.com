export interface ChessStats {
  rapid: number | null;
  blitz: number | null;
  bullet: number | null;
}

const CHESS_USERNAME = "javablob";

// Last good value - a failed fetch never clears it
let cachedStats: ChessStats | null = null;

export function getCachedChessStats(): ChessStats | null {
  return cachedStats;
}

export async function fetchChessStats(): Promise<void> {
  try {
    const response = await fetch(
      "https://api.chess.com/pub/player/" + CHESS_USERNAME + "/stats",
      {
        headers: {
          "User-Agent": "willhao.com (william.hao.55@gmail.com)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
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

    cachedStats = {
      rapid: rapidRating,
      blitz: blitzRating,
      bullet: bulletRating,
    };
  } catch (error) {
    console.error("Chess.com API error:", error);
  }
}
