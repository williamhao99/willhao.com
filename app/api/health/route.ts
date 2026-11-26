// UptimeRobot and deploy.yml poll this - don't rename
export async function GET(): Promise<Response> {
  return Response.json({ status: "ok" });
}
