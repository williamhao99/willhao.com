// Server-only configuration and secrets
// Client components should NEVER IMPORT THIS FILE

// API credentials (server-only)
export const CHESS_USERNAME = "javablob";
export const CLASH_API_TOKEN = process.env.CLASH_API_TOKEN;
export const CLASH_PLAYER_TAG = process.env.CLASH_PLAYER_TAG;
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
export const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// Rate limiting settings
export const RATE_LIMIT_COUNT = 100; // requests per window
export const RATE_LIMIT_WINDOW = 60000; // 1 minute
