import { NextResponse } from "next/server";

// UptimeRobot and deploy.yml poll this - don't rename
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: "ok" });
}
