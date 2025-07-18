// lib/database.js
import { Pool } from 'pg';

// Database configuration
const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'willhao_db',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create a global connection pool
let pool;

if (typeof window === 'undefined') {
  // Only create pool on server-side
  pool = new Pool(config);

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
}

/**
 * Execute a SQL query with parameters
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function query(text, params) {
  const start = Date.now();

  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.log('Slow query detected:', { text, duration, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    console.error('Database query error:', { text, params, error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
export async function getClient() {
  return await pool.connect();
}

/**
 * Close the database pool (for graceful shutdown)
 */
export async function closePool() {
  if (pool) {
    await pool.end();
  }
}

// Database helper functions for widgets

/**
 * Store chess statistics in database
 * @param {string} username - Chess.com username
 * @param {Object} stats - Chess statistics object
 * @returns {Promise<Object>} Inserted record
 */
export async function storeChessStats(username, stats) {
  const queryText = `
    INSERT INTO chess_stats (
      username, rapid_rating, rapid_games_played, rapid_wins, rapid_losses, rapid_draws,
      blitz_rating, blitz_games_played, blitz_wins, blitz_losses, blitz_draws,
      bullet_rating, bullet_games_played, bullet_wins, bullet_losses, bullet_draws,
      daily_rating, daily_games_played, daily_wins, daily_losses, daily_draws,
      total_games
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
    RETURNING *
  `;

  const values = [
    username,
    stats.chess_rapid?.last?.rating || null,
    stats.chess_rapid?.last?.games_played || null,
    stats.chess_rapid?.record?.win || null,
    stats.chess_rapid?.record?.loss || null,
    stats.chess_rapid?.record?.draw || null,
    stats.chess_blitz?.last?.rating || null,
    stats.chess_blitz?.last?.games_played || null,
    stats.chess_blitz?.record?.win || null,
    stats.chess_blitz?.record?.loss || null,
    stats.chess_blitz?.record?.draw || null,
    stats.chess_bullet?.last?.rating || null,
    stats.chess_bullet?.last?.games_played || null,
    stats.chess_bullet?.record?.win || null,
    stats.chess_bullet?.record?.loss || null,
    stats.chess_bullet?.record?.draw || null,
    stats.chess_daily?.last?.rating || null,
    stats.chess_daily?.last?.games_played || null,
    stats.chess_daily?.record?.win || null,
    stats.chess_daily?.record?.loss || null,
    stats.chess_daily?.record?.draw || null,
    stats.totalGames || null
  ];

  const result = await query(queryText, values);
  return result.rows[0];
}

/**
 * Get latest chess statistics
 * @param {string} username - Chess.com username
 * @returns {Promise<Object|null>} Latest chess stats or null
 */
export async function getLatestChessStats(username) {
  const result = await query(
    'SELECT * FROM latest_chess_stats WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

/**
 * Store Spotify activity in database
 * @param {Object} activity - Spotify activity object
 * @returns {Promise<Object>} Inserted record
 */
export async function storeSpotifyActivity(activity) {
  const queryText = `
    INSERT INTO spotify_activity (
      track_name, artist_name, album_name, track_url, artist_url,
      album_image_url, is_playing, played_at, duration_ms, progress_ms
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;

  const values = [
    activity.track_name || null,
    activity.artist_name || null,
    activity.album_name || null,
    activity.track_url || null,
    activity.artist_url || null,
    activity.album_image_url || null,
    activity.is_playing || false,
    activity.played_at ? new Date(activity.played_at) : null,
    activity.duration_ms || null,
    activity.progress_ms || null
  ];

  const result = await query(queryText, values);
  return result.rows[0];
}

/**
 * Get latest Spotify activity
 * @returns {Promise<Object|null>} Latest Spotify activity or null
 */
export async function getLatestSpotifyActivity() {
  const result = await query('SELECT * FROM latest_spotify_activity');
  return result.rows[0] || null;
}

/**
 * Clean up old Spotify activity records
 * @param {number} daysToKeep - Number of days of data to keep (default: 7)
 * @returns {Promise<number>} Number of records deleted
 */
export async function cleanupOldSpotifyActivity(daysToKeep = 7) {
  const result = await query('SELECT cleanup_old_spotify_activity($1)', [daysToKeep]);
  return result.rows[0].cleanup_old_spotify_activity;
}

/**
 * Limit total Spotify activity records to a maximum count
 * @param {number} maxRecords - Maximum number of records to keep (default: 1000)
 * @returns {Promise<number>} Number of records deleted
 */
export async function limitSpotifyActivityRecords(maxRecords = 1000) {
  const result = await query('SELECT limit_spotify_activity_records($1)', [maxRecords]);
  return result.rows[0].limit_spotify_activity_records;
}

/**
 * Store Clash of Clans statistics
 * @param {string} playerTag - Clash of Clans player tag
 * @param {Object} stats - Clash statistics object
 * @returns {Promise<Object>} Inserted record
 */
export async function storeClashStats(playerTag, stats) {
  const queryText = `
    INSERT INTO clash_stats (
      player_tag, player_name, town_hall_level, experience_level, trophies,
      best_trophies, war_stars, attack_wins, defense_wins, clan_name,
      clan_tag, clan_role, league_name
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;

  const values = [
    playerTag,
    stats.name || null,
    stats.townHallLevel || null,
    stats.expLevel || null,
    stats.trophies || null,
    stats.bestTrophies || null,
    stats.warStars || null,
    stats.attackWins || null,
    stats.defenseWins || null,
    stats.clan?.name || null,
    stats.clan?.tag || null,
    stats.role || null,
    stats.league?.name || null
  ];

  const result = await query(queryText, values);
  return result.rows[0];
}

/**
 * Get latest Clash of Clans statistics
 * @param {string} playerTag - Player tag
 * @returns {Promise<Object|null>} Latest clash stats or null
 */
export async function getLatestClashStats(playerTag) {
  const result = await query(
    'SELECT * FROM latest_clash_stats WHERE player_tag = $1',
    [playerTag]
  );
  return result.rows[0] || null;
}

/**
 * Log API request for analytics
 * @param {Object} requestData - Request data to log
 * @returns {Promise<Object>} Logged request record
 */
export async function logApiRequest(requestData) {
  const queryText = `
    INSERT INTO api_requests (ip_address, endpoint, method, status_code, response_time_ms, user_agent, referer)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    requestData.ip_address,
    requestData.endpoint,
    requestData.method,
    requestData.status_code,
    requestData.response_time_ms,
    requestData.user_agent || null,
    requestData.referer || null
  ];

  const result = await query(queryText, values);
  return result.rows[0];
}

/**
 * Cache external API response
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {number} ttlSeconds - Time to live in seconds
 * @returns {Promise<void>}
 */
export async function setCache(key, data, ttlSeconds = 120) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await query(`
    INSERT INTO api_cache (cache_key, data, expires_at, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (cache_key)
    DO UPDATE SET data = $2, expires_at = $3, updated_at = CURRENT_TIMESTAMP
  `, [key, data, expiresAt]);
}

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {Promise<Object|null>} Cached data or null if not found/expired
 */
export async function getCache(key) {
  const result = await query(
    'SELECT data FROM api_cache WHERE cache_key = $1 AND expires_at > CURRENT_TIMESTAMP',
    [key]
  );

  if (result.rows.length > 0) {
    return result.rows[0].data;
  }

  return null;
}