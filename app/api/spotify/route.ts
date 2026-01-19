import { NextResponse } from "next/server";
import {
  fetchSpotifyData,
  getCachedSpotifyData,
  type SpotifyData,
} from "@/lib/data/spotify";

const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "—",
  artist: "—",
};

export async function GET() {
  // Try cached data first (instant response)
  const cached = getCachedSpotifyData();
  if (cached) {
    return NextResponse.json(cached);
  }

  // No cache - fetch fresh
  try {
    const data = await fetchSpotifyData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_DATA, { status: 503 });
  }
}
