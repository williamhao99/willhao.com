import { NextResponse } from "next/server";
import { fetchSpotifyData } from "@/lib/data/spotify";

export async function GET() {
  try {
    const data = await fetchSpotifyData();
    return NextResponse.json(data);
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
