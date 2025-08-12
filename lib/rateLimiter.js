import { RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW } from "@/lib/config.server";

// Simple in-memory rate limiter
const ipRequestCounts = new Map();

// Check if request exceeds rate limit - returns false if over limit
export function checkRateLimit(request) {
  // Extract client IP from request headers (best effort)
  const ip =
    request.ip ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Cleanup: remove expired entries when map gets large
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

  // Keep only recent requests and add this one
  const requests = (ipRequestCounts.get(ip) || []).filter(
    (timestamp) => timestamp > windowStart,
  );
  requests.push(now);
  ipRequestCounts.set(ip, requests);

  return requests.length <= RATE_LIMIT_COUNT;
}
