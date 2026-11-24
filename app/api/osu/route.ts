import { NextResponse } from "next/server";
import { fetchOsuStats } from "@/lib/data/osu";

export async function GET() {
  try {
    const data = await fetchOsuStats();
    return NextResponse.json(data);
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
