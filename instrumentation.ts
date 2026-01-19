export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const spotify = await import("@/lib/data/spotify");
    const chess = await import("@/lib/data/chess");

    // Start background refresh immediately on server start
    spotify.startBackgroundRefresh();
    chess.startBackgroundRefresh();

    // Warm the caches right now
    await Promise.all([spotify.fetchSpotifyData(), chess.fetchChessStats()]);
  }
}
