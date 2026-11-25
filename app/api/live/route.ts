import { NextResponse } from "next/server";
import { getCachedLive } from "@/lib/data/live";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getCachedLive());
}
