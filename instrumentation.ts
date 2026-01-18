export async function register() {
  // Only run on Node.js server (not edge runtime or during build)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startBackgroundRefresh } = await import("@/lib/data/spotify");
    startBackgroundRefresh();
  }
}
