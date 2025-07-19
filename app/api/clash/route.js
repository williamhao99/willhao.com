import { fetchClashPlayer } from "@/lib/widgetApiBackend";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";

// clash of clans API endpoint
export async function GET(request) {
  // rate limit check
  if (!checkRateLimit(request)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const player = await fetchClashPlayer();

    return NextResponse.json(player, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch Clash of Clans player data" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  }
}
