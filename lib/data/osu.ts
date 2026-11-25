export interface OsuStats {
  globalRank: number | null;
  peakRank: number | null;
  pp: number | null;
  playTime: number | null; // In hours
}

const REFRESH_INTERVAL = 60 * 1000;

// Tokens last 24h
let cachedToken: { token: string; expires: number } | null = null;

// Last good value - a failed fetch never clears it
let cachedStats: OsuStats | null = null;

export function getCachedOsuStats(): OsuStats | null {
  return cachedStats;
}

let backgroundRefreshStarted = false;

export function startBackgroundRefresh() {
  if (backgroundRefreshStarted) return;
  backgroundRefreshStarted = true;

  setInterval(function refreshCache() {
    fetchOsuStats().catch(function handleError(error) {
      console.error("osu! background refresh error:", error);
    });
  }, REFRESH_INTERVAL);
}

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

  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

export async function fetchOsuStats(): Promise<OsuStats> {
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

    // /osu = standard mode
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
      if (response.status === 401) {
        cachedToken = null;
      }
      throw new Error("osu! API returned " + response.status);
    }

    const data = await response.json();

    let globalRank = null;
    if (
      data.statistics &&
      data.statistics.global_rank !== null &&
      data.statistics.global_rank !== undefined
    ) {
      globalRank = data.statistics.global_rank;
    }

    let pp = null;
    if (
      data.statistics &&
      data.statistics.pp !== null &&
      data.statistics.pp !== undefined
    ) {
      pp = Math.round(data.statistics.pp);
    }

    let playTime = null;
    if (
      data.statistics &&
      data.statistics.play_time !== null &&
      data.statistics.play_time !== undefined
    ) {
      playTime = Math.round(data.statistics.play_time / 3600);
    }

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

    cachedStats = stats;

    return stats;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("osu! API timeout after 5 seconds");
      throw new Error("osu! API request timed out");
    }
    console.error("osu! API error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
