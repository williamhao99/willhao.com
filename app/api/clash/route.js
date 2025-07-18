import { NextResponse } from "next/server";
import {
  logApiRequest,
  getLatestClashStats,
  getCache,
  setCache
} from "@/lib/database";
import { CLASH_PLAYER_TAG } from "@/lib/config.js";

// Helper function to get client IP
function getClientIP(request) {
  return (
    request.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function GET(request) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);
  const endpoint = "/api/clash";

  try {
    // Try to get cached data first
    const cacheKey = `clash-${CLASH_PLAYER_TAG}`;
    let cachedData = await getCache(cacheKey);

    if (cachedData) {
      // Log successful cached request
      await logApiRequest({
        ip_address: clientIP,
        endpoint,
        method: "GET",
        status_code: 200,
        response_time_ms: Date.now() - startTime,
        user_agent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
      });

      return NextResponse.json(cachedData, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-Data-Source": "cache"
        },
      });
    }

    // Get latest data from database
    const dbStats = await getLatestClashStats(CLASH_PLAYER_TAG);

    if (dbStats) {
      // Convert database format to API format
      const apiResponse = {
        name: dbStats.player_name,
        tag: dbStats.player_tag,
        townHallLevel: dbStats.town_hall_level,
        expLevel: dbStats.experience_level,
        trophies: dbStats.trophies,
        bestTrophies: dbStats.best_trophies,
        warStars: dbStats.war_stars,
        attackWins: dbStats.attack_wins,
        defenseWins: dbStats.defense_wins,
        clan: dbStats.clan_name ? {
          name: dbStats.clan_name,
          tag: dbStats.clan_tag
        } : null,
        role: dbStats.clan_role,
        league: dbStats.league_name ? {
          name: dbStats.league_name
        } : null,
        lastUpdated: dbStats.fetched_at
      };

      // Cache this data
      await setCache(cacheKey, apiResponse, 30);

      // Log successful database request
      await logApiRequest({
        ip_address: clientIP,
        endpoint,
        method: "GET",
        status_code: 200,
        response_time_ms: Date.now() - startTime,
        user_agent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
      });

      return NextResponse.json(apiResponse, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-Data-Source": "database"
        },
      });
    }

    // No data available in database
    const noDataResponse = {
      name: null,
      tag: CLASH_PLAYER_TAG,
      townHallLevel: null,
      expLevel: null,
      trophies: null,
      bestTrophies: null,
      warStars: null,
      attackWins: null,
      defenseWins: null,
      clan: null,
      role: null,
      league: null,
      lastUpdated: new Date().toISOString()
    };

    // Log no data response
    await logApiRequest({
      ip_address: clientIP,
      endpoint,
      method: "GET",
      status_code: 200,
      response_time_ms: Date.now() - startTime,
      user_agent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });

    return NextResponse.json(noDataResponse, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "X-Data-Source": "empty"
      },
    });

  } catch (error) {
    console.error("Database error:", error);

    // Log error request
    await logApiRequest({
      ip_address: clientIP,
      endpoint,
      method: "GET",
      status_code: 500,
      response_time_ms: Date.now() - startTime,
      user_agent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });

    return NextResponse.json(
      {
        error: "Failed to fetch data from database",
        details: error.message
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  }
}
