import { NextResponse } from "next/server";
import {
  logApiRequest,
  getLatestSpotifyActivity,
  getCache,
  setCache
} from "@/lib/database";

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
  const endpoint = "/api/spotify";

  try {
    // Try to get cached data first (very short cache for responsiveness)
    const cacheKey = "spotify-activity";
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
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
          "X-Data-Source": "cache"
        },
      });
    }

    // Get latest data from database
    const dbActivity = await getLatestSpotifyActivity();

    if (dbActivity) {
      // Convert database format to API format
      const apiResponse = {
        trackName: dbActivity.track_name,
        artistName: dbActivity.artist_name,
        albumName: dbActivity.album_name,
        trackUrl: dbActivity.track_url,
        artistUrl: dbActivity.artist_url,
        albumArt: dbActivity.album_image_url,
        isPlaying: dbActivity.is_playing,
        lastPlayed: dbActivity.played_at,
        duration_ms: dbActivity.duration_ms,
        progress_ms: dbActivity.progress_ms,
        lastUpdated: dbActivity.fetched_at
      };

      // Cache this data for a short duration
      await setCache(cacheKey, apiResponse, 5);

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
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
          "X-Data-Source": "database"
        },
      });
    }

    // No data available in database
    const noDataResponse = {
      trackName: null,
      artistName: null,
      albumName: null,
      trackUrl: null,
      artistUrl: null,
      albumArt: null,
      isPlaying: false,
      lastPlayed: null,
      duration_ms: null,
      progress_ms: null,
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
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
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
