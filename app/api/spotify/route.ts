import { NextResponse } from "next/server";
import { fetchSpotifyData, type SpotifyData } from "@/lib/data/spotify";

const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "—",
  artist: "—",
};

export async function GET() {
  // Cache-first; serves stale data on upstream failure
  try {
    const data = await fetchSpotifyData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_DATA, { status: 503 });
  }
}
