import { NextResponse } from "next/server";
import {
  logApiRequest,
  getLatestChessStats,
  getCache,
  setCache
} from "@/lib/database";
import { CHESS_USERNAME } from "@/lib/config.js";

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
  const endpoint = "/api/chess";

  try {
    // Try to get cached data first
    const cacheKey = `chess-${CHESS_USERNAME}`;
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
    const dbStats = await getLatestChessStats(CHESS_USERNAME);

    if (dbStats) {
      // Convert database format to API format
      const apiResponse = {
        rapid: {
          rating: dbStats.rapid_rating,
          games: dbStats.rapid_games_played || 0,
          record: {
            win: dbStats.rapid_wins || 0,
            loss: dbStats.rapid_losses || 0,
            draw: dbStats.rapid_draws || 0
          }
        },
        blitz: {
          rating: dbStats.blitz_rating,
          games: dbStats.blitz_games_played || 0,
          record: {
            win: dbStats.blitz_wins || 0,
            loss: dbStats.blitz_losses || 0,
            draw: dbStats.blitz_draws || 0
          }
        },
        bullet: {
          rating: dbStats.bullet_rating,
          games: dbStats.bullet_games_played || 0,
          record: {
            win: dbStats.bullet_wins || 0,
            loss: dbStats.bullet_losses || 0,
            draw: dbStats.bullet_draws || 0
          }
        },
        daily: {
          rating: dbStats.daily_rating,
          games: dbStats.daily_games_played || 0,
          record: {
            win: dbStats.daily_wins || 0,
            loss: dbStats.daily_losses || 0,
            draw: dbStats.daily_draws || 0
          }
        },
        totalGames: dbStats.total_games || 0,
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
      rapid: { rating: null, games: 0, record: { win: 0, loss: 0, draw: 0 } },
      blitz: { rating: null, games: 0, record: { win: 0, loss: 0, draw: 0 } },
      bullet: { rating: null, games: 0, record: { win: 0, loss: 0, draw: 0 } },
      daily: { rating: null, games: 0, record: { win: 0, loss: 0, draw: 0 } },
      totalGames: 0,
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
