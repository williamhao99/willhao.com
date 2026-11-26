import { getCachedLive } from "@/lib/data/live";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(getCachedLive());
}
