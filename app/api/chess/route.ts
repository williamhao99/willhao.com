import { NextResponse } from "next/server";
import {
  fetchChessStats,
  getCachedChessStats,
  type ChessStats,
} from "@/lib/data/chess";

const DEFAULT_DATA: ChessStats = {
  rapid: null,
  blitz: null,
  bullet: null,
};

export async function GET() {
  // Try cached data first (instant response)
  const cached = getCachedChessStats();
  if (cached) {
    return NextResponse.json(cached);
  }

  // No cache - fetch fresh
  try {
    const data = await fetchChessStats();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_DATA);
  }
}
