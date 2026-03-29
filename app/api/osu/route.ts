import { NextResponse } from "next/server";
import {
  fetchOsuStats,
  getCachedOsuStats,
  type OsuStats,
} from "@/lib/data/osu";

const DEFAULT_DATA: OsuStats = {
  globalRank: null,
  peakRank: null,
  pp: null,
  playTime: null,
};

export async function GET() {
  // Try cached data first (instant response)
  const cached = getCachedOsuStats();
  if (cached) {
    return NextResponse.json(cached);
  }

  // No cache - fetch fresh
  try {
    const data = await fetchOsuStats();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_DATA, { status: 503 });
  }
}
