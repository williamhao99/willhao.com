export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const spotify = await import("@/lib/data/spotify");
    const chess = await import("@/lib/data/chess");
    const osu = await import("@/lib/data/osu");

    spotify.startBackgroundRefresh();
    chess.startBackgroundRefresh();
    osu.startBackgroundRefresh();

    // Warm caches
    try {
      await Promise.all([
        spotify.fetchSpotifyData(),
        chess.fetchChessStats(),
        osu.fetchOsuStats(),
      ]);
    } catch (error) {
      console.error("Failed to warm cache on startup:", error);
    }
  }
}
