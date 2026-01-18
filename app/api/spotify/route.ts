import { NextResponse } from "next/server";
import {
  fetchSpotifyData,
  getCachedSpotifyData,
  startBackgroundRefresh,
  type SpotifyData,
} from "@/lib/data/spotify";

// Default data for cold starts
const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "Loading...",
  artist: "—",
};

export async function GET() {
  // Ensure background refresh is running (no-op if already started)
  startBackgroundRefresh();

  // Try to return cached data first (instant response)
  const cached = getCachedSpotifyData();
  if (cached) {
    return NextResponse.json(cached);
  }

  // No cached data - fetch fresh (only happens on cold start)
  try {
    const data = await fetchSpotifyData();
    return NextResponse.json(data);
  } catch {
    // Return default data on error
    return NextResponse.json(DEFAULT_DATA);
  }
}
