import { NextResponse } from "next/server";
import { fetchChessStats } from "@/lib/data/chess";

export async function GET() {
  try {
    const data = await fetchChessStats();
    return NextResponse.json(data);
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
