import { NextResponse } from "next/server";
import { fetchSpotifyStats } from "@/lib/widgetApiBackend";
import { checkRateLimit } from "@/lib/rateLimiter";

export async function GET(request) {
  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const spotifyData = await fetchSpotifyStats();
    return NextResponse.json(spotifyData, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=2, stale-while-revalidate=4, stale-if-error=60",
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
