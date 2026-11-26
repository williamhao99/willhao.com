export interface OsuStats {
  globalRank: number | null;
  peakRank: number | null;
  pp: number | null;
  playTime: number | null; // In hours
}

// Tokens last 24h
let cachedToken: { token: string; expires: number } | null = null;

// Last good value - a failed fetch never clears it
let cachedStats: OsuStats | null = null;

export function getCachedOsuStats(): OsuStats | null {
  return cachedStats;
}

async function getAccessToken(signal: AbortSignal): Promise<string> {
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

export async function fetchOsuStats(): Promise<void> {
  const signal = AbortSignal.timeout(5000);

  try {
    const username = process.env.OSU_USERNAME;
    if (!username) {
      throw new Error("Missing OSU_USERNAME");
    }

    const accessToken = await getAccessToken(signal);

    // /osu = standard mode
    const response = await fetch(
      "https://osu.ppy.sh/api/v2/users/@" + username + "/osu",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        },
        signal: signal,
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
    if (data.statistics) {
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
    if (data.rank_highest) {
      peakRank = data.rank_highest.rank;
    }

    cachedStats = {
      globalRank: globalRank,
      peakRank: peakRank,
      pp: pp,
      playTime: playTime,
    };
  } catch (error) {
    console.error("osu! API error:", error);
  }
}
