import { NextResponse } from "next/server";

// Liveness probe for external uptime monitoring - a 200 here proves the
// Next.js process is up and serving dynamic routes, not just static files
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: "ok" });
}
