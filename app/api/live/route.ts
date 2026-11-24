import { NextResponse } from "next/server";
import { fetchLive } from "@/lib/data/live";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await fetchLive());
}
