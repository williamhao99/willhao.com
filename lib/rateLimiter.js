import { RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW } from "./config";

// in-memory rate limiting
const ipRequestCounts = new Map();

// check if request exceeds rate limit
export function checkRateLimit(request) {
  // extract IP from various headers
  const ip =
    request.ip ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // cleanup old entries
  if (ipRequestCounts.size > 1000) {
    for (const [key, requests] of ipRequestCounts.entries()) {
      const validRequests = requests.filter(
        (timestamp) => timestamp > windowStart,
      );
      if (validRequests.length === 0) {
        ipRequestCounts.delete(key);
      } else {
        ipRequestCounts.set(key, validRequests);
      }
    }
  }

  // filter recent requests & add current
  const requests = (ipRequestCounts.get(ip) || []).filter(
    (timestamp) => timestamp > windowStart,
  );
  requests.push(now);
  ipRequestCounts.set(ip, requests);

  return requests.length <= RATE_LIMIT_COUNT;
}
