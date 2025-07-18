import { NextResponse } from "next/server";
import {
  storeSpotifyActivity,
  getLatestSpotifyActivity,
  storeChessStats,
  getLatestChessStats,
  storeClashStats,
  getLatestClashStats,
  cleanupOldSpotifyActivity
} from "@/lib/database";
import { fetchSpotifyStats, fetchClashPlayer } from "@/lib/widgetApiBackend";
import { CHESS_USERNAME, CLASH_PLAYER_TAG } from "@/lib/config.js";

// Helper function to fetch Chess.com API with timeout
async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function updateSpotifyData() {
  try {
    const spotifyData = await fetchSpotifyStats();

    const transformedSpotifyData = {
      track_name: spotifyData.trackName,
      artist_name: spotifyData.artistName,
      album_name: spotifyData.albumName,
      track_url: spotifyData.trackUrl,
      artist_url: spotifyData.artistUrl || null,
      album_image_url: spotifyData.albumArt,
      is_playing: spotifyData.isPlaying,
      played_at: spotifyData.lastPlayed,
      duration_ms: spotifyData.duration_ms || null,
      progress_ms: spotifyData.progress_ms || null
    };

    const dbActivity = await getLatestSpotifyActivity();

    let shouldStore = true;
    if (dbActivity) {
      const isSameTrack = dbActivity.track_name === transformedSpotifyData.track_name &&
                         dbActivity.artist_name === transformedSpotifyData.artist_name &&
                         dbActivity.is_playing === transformedSpotifyData.is_playing;

      if (isSameTrack) {
        shouldStore = false;
      }
    }

    if (shouldStore) {
      await storeSpotifyActivity(transformedSpotifyData);
      return {
        updated: true,
        track: `${transformedSpotifyData.track_name || 'No track'} by ${transformedSpotifyData.artist_name || 'Unknown'}`
      };
    }

    return { updated: false, reason: 'Same track/state' };

  } catch (error) {
    return { error: error.message };
  }
}

async function updateChessData() {
  try {
    const statsResponse = await fetchWithTimeout(
      `https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`,
      {
        headers: {
          "User-Agent": "willhao.com Chess Stats Widget (https://willhao.com; william.hao.55@gmail.com) Node.js/fetch",
        },
      },
      8000
    );

    if (!statsResponse.ok) {
      throw new Error(`Chess API error: ${statsResponse.status}`);
    }

    const statsData = await statsResponse.json();
    const dbStats = await getLatestChessStats(CHESS_USERNAME);

    let shouldStore = true;
    if (dbStats) {
      const currentRapidRating = statsData.chess_rapid?.last?.rating || null;
      const currentBlitzRating = statsData.chess_blitz?.last?.rating || null;
      const currentTotalGames = (statsData.chess_rapid?.last?.games_played || 0) +
                               (statsData.chess_blitz?.last?.games_played || 0) +
                               (statsData.chess_bullet?.last?.games_played || 0) +
                               (statsData.chess_daily?.last?.games_played || 0);

      const isSameData = dbStats.rapid_rating === currentRapidRating &&
                        dbStats.blitz_rating === currentBlitzRating &&
                        dbStats.total_games === currentTotalGames;

      if (isSameData) {
        shouldStore = false;
      }
    }

    if (shouldStore) {
      await storeChessStats(CHESS_USERNAME, statsData);
      const rapidRating = statsData.chess_rapid?.last?.rating || 'N/A';
      const blitzRating = statsData.chess_blitz?.last?.rating || 'N/A';
      return {
        updated: true,
        stats: `Rapid ${rapidRating}, Blitz ${blitzRating}`
      };
    }

    return { updated: false, reason: 'Same stats' };

  } catch (error) {
    return { error: error.message };
  }
}

async function updateClashData() {
  try {
    const clashData = await fetchClashPlayer();
    const dbStats = await getLatestClashStats(CLASH_PLAYER_TAG);

    let shouldStore = true;
    if (dbStats) {
      const isSameData = dbStats.trophies === clashData.trophies &&
                        dbStats.experience_level === clashData.expLevel &&
                        dbStats.town_hall_level === clashData.townHallLevel;

      if (isSameData) {
        shouldStore = false;
      }
    }

    if (shouldStore) {
      await storeClashStats(CLASH_PLAYER_TAG, clashData);
      return {
        updated: true,
        stats: `TH${clashData.townHallLevel || 'N/A'}, ${clashData.trophies || 'N/A'} trophies`
      };
    }

    return { updated: false, reason: 'Same stats' };

  } catch (error) {
    return { error: error.message };
  }
}

export async function GET(request) {
  const startTime = Date.now();

  try {
    // Update all widgets in parallel
    const [spotifyResult, chessResult, clashResult] = await Promise.allSettled([
      updateSpotifyData(),
      updateChessData(),
      updateClashData()
    ]);

    // Occasionally run cleanup (1% chance)
    let cleanupResult = null;
    if (Math.random() < 0.01) {
      try {
        const deletedRecords = await cleanupOldSpotifyActivity(7);
        if (deletedRecords > 0) {
          cleanupResult = `Cleaned up ${deletedRecords} old records`;
        }
      } catch (cleanupError) {
        cleanupResult = `Cleanup error: ${cleanupError.message}`;
      }
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      results: {
        spotify: spotifyResult.status === 'fulfilled' ? spotifyResult.value : { error: spotifyResult.reason?.message },
        chess: chessResult.status === 'fulfilled' ? chessResult.value : { error: chessResult.reason?.message },
        clash: clashResult.status === 'fulfilled' ? clashResult.value : { error: clashResult.reason?.message }
      },
      cleanup: cleanupResult
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}