import { NextResponse } from "next/server";
import { fetchSpotifyStats } from "@/lib/widgetApiBackend";
import { checkRateLimit } from "@/lib/rateLimiter";

// Spotify now playing
export async function GET(request) {
  // Rate limit
  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const spotifyData = await fetchSpotifyStats();
    return NextResponse.json(spotifyData, {
      status: 200,
      headers: {
        // keep a short cache, data is near-realtime
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
      },
    });
  } catch (error) {
    console.error("Spotify API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Spotify data" },
      { status: 500 },
    );
  }
}
