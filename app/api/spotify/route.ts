import { NextResponse } from "next/server";
import { fetchSpotifyData, getCachedSpotifyData } from "@/lib/data/spotify";

export async function GET() {
  // Try cached data first (instant response)
  const cached = getCachedSpotifyData();
  if (cached) {
    return NextResponse.json(cached);
  }

  // No cache - fetch fresh
  const data = await fetchSpotifyData();
  return NextResponse.json(data);
}
