import { fetchChessStats } from "@/lib/widgetApiBackend";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";

export async function GET(request) {
  // Check rate limit
  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const stats = await fetchChessStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch chess stats" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  }
}
