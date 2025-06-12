import { NextResponse } from "next/server";
import { fetchSpotifyStats } from "@/lib/widgetApiBackend";
import { checkRateLimit } from "@/lib/rateLimiter";

export async function GET(request) {
  // Check rate limit
  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const spotifyData = await fetchSpotifyStats();
    return NextResponse.json(spotifyData);
  } catch (error) {
    console.error("Spotify API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Spotify data" },
      { status: 500 },
    );
  }
}
