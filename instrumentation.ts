export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const spotify = await import("@/lib/data/spotify");
    const chess = await import("@/lib/data/chess");
    const osu = await import("@/lib/data/osu");
    const live = await import("@/lib/data/live");

    live.shareLive(function getLive() {
      return {
        spotify: spotify.getCachedSpotifyData(),
        chess: chess.getCachedChessStats(),
        osu: osu.getCachedOsuStats(),
      };
    });

    setInterval(spotify.fetchSpotifyData, 2 * 1000);
    setInterval(chess.fetchChessStats, 60 * 1000);
    setInterval(osu.fetchOsuStats, 60 * 1000);

    // Warm caches
    await Promise.allSettled([
      spotify.fetchSpotifyData(),
      chess.fetchChessStats(),
      osu.fetchOsuStats(),
    ]);
  }
}
