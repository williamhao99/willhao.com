export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const spotify = await import("@/lib/data/spotify");
    const chess = await import("@/lib/data/chess");
    const osu = await import("@/lib/data/osu");

    // Start background refresh immediately on server start
    spotify.startBackgroundRefresh();
    chess.startBackgroundRefresh();
    osu.startBackgroundRefresh();

    // Warm the caches - don't crash server if API fails
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
