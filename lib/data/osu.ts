// Type definition for the osu! stats we return to UI components
export interface OsuStats {
  globalRank: number | null;
  peakRank: number | null;
  pp: number | null;
  playTime: number | null; // in hours
}

// Configuration constants
// Cache TTL outlives the refresh interval so a failed background refresh
// serves stale data instead of an empty cache
const CACHE_DURATION = 150 * 1000;
const REFRESH_INTERVAL = 60 * 1000;

// Token cache - osu! client credentials tokens last 24 hours
let cachedToken: { token: string; expires: number } | null = null;

// Data cache
let cachedStats: { data: OsuStats; expires: number } | null = null;

// Get cached data if available and not expired
export function getCachedOsuStats(): OsuStats | null {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return null;
}

// Background refresh to keep cache warm
let backgroundRefreshStarted = false;

export function startBackgroundRefresh() {
  if (backgroundRefreshStarted) return;
  backgroundRefreshStarted = true;

  setInterval(function refreshCache() {
    startFetch().catch(function handleError(error) {
      console.error("osu! background refresh error:", error);
    });
  }, REFRESH_INTERVAL);
}

// Get access token via OAuth2 client credentials grant
async function getAccessToken(
  signal: AbortSignal | null = null,
): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const clientId = process.env.OSU_CLIENT_ID;
  const clientSecret = process.env.OSU_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing osu! API credentials");
  }

  const response = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "public",
    }),
    signal: signal,
  });

  if (!response.ok) {
    throw new Error("osu! token request failed: " + response.status);
  }

  const data = await response.json();

  // Cache token with 60-second buffer before actual expiry
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

// Single-flight guard so concurrent cache misses share one upstream request
let inFlightFetch: Promise<OsuStats> | null = null;

// Always fetches (bypasses the TTL check) - used by the background refresh
async function startFetch(): Promise<OsuStats> {
  if (inFlightFetch) {
    return inFlightFetch;
  }

  const fetchPromise = fetchFreshOsuStats();
  inFlightFetch = fetchPromise;
  try {
    return await fetchPromise;
  } finally {
    inFlightFetch = null;
  }
}

// Cache-first read used by the API route and instrumentation warm-up
export async function fetchOsuStats(): Promise<OsuStats> {
  if (cachedStats && Date.now() < cachedStats.expires) {
    return cachedStats.data;
  }
  return startFetch();
}

// Fetch fresh stats from the osu! API and update the cache
async function fetchFreshOsuStats(): Promise<OsuStats> {
  // Set up timeout handling (5 second limit)
  const controller = new AbortController();

  function abortRequest() {
    controller.abort();
  }
  const timeoutId = setTimeout(abortRequest, 5000);

  try {
    const username = process.env.OSU_USERNAME;
    if (!username) {
      throw new Error("Missing OSU_USERNAME");
    }

    const accessToken = await getAccessToken(controller.signal);

    // Fetch user profile with osu! standard mode stats
    const response = await fetch(
      "https://osu.ppy.sh/api/v2/users/@" + username + "/osu",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("osu! API returned " + response.status);
    }

    const data = await response.json();

    // Extract global rank from statistics
    let globalRank = null;
    if (
      data.statistics &&
      data.statistics.global_rank !== null &&
      data.statistics.global_rank !== undefined
    ) {
      globalRank = data.statistics.global_rank;
    }

    // Extract pp (performance points), rounded to integer
    let pp = null;
    if (
      data.statistics &&
      data.statistics.pp !== null &&
      data.statistics.pp !== undefined
    ) {
      pp = Math.round(data.statistics.pp);
    }

    // Extract play time, converted from seconds to hours
    let playTime = null;
    if (
      data.statistics &&
      data.statistics.play_time !== null &&
      data.statistics.play_time !== undefined
    ) {
      playTime = Math.round(data.statistics.play_time / 3600);
    }

    // Extract peak rank from rank_highest
    let peakRank = null;
    if (
      data.rank_highest &&
      data.rank_highest.rank !== null &&
      data.rank_highest.rank !== undefined
    ) {
      peakRank = data.rank_highest.rank;
    }

    const stats = {
      globalRank: globalRank,
      peakRank: peakRank,
      pp: pp,
      playTime: playTime,
    };

    // Cache the stats
    cachedStats = {
      data: stats,
      expires: Date.now() + CACHE_DURATION,
    };

    return stats;
  } catch (error) {
    // Handle timeout vs other errors differently
    if (error instanceof Error && error.name === "AbortError") {
      console.error("osu! API timeout after 5 seconds");
      throw new Error("osu! API request timed out");
    }
    console.error("osu! API error:", error);
    throw error;
  } finally {
    // Always clean up the timeout
    clearTimeout(timeoutId);
  }
}
