export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const spotify = await import("@/lib/data/spotify");
    const chess = await import("@/lib/data/chess");
    const osu = await import("@/lib/data/osu");
    const live = await import("@/lib/data/live");

    live.shareLive({
      getCached: function getCached() {
        return {
          spotify: spotify.getCachedSpotifyData(),
          chess: chess.getCachedChessStats(),
          osu: osu.getCachedOsuStats(),
        };
      },
      // Only Spotify may wait on its API - the others answer from memory
      fetch: async function fetchAll() {
        let spotifyData = null;
        try {
          spotifyData = await spotify.fetchSpotifyData();
        } catch {
          // Row keeps its last value
        }
        return {
          spotify: spotifyData,
          chess: chess.getCachedChessStats(),
          osu: osu.getCachedOsuStats(),
        };
      },
    });

    spotify.startBackgroundRefresh();
    chess.startBackgroundRefresh();
    osu.startBackgroundRefresh();

    // Warm caches
    await Promise.allSettled([
      spotify.fetchSpotifyData(),
      chess.fetchChessStats(),
      osu.fetchOsuStats(),
    ]);
  }
}
