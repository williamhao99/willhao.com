export const CHESS_USERNAME = "javablob";
export const CLASH_API_TOKEN = process.env.CLASH_API_TOKEN;
export const CLASH_PLAYER_TAG = process.env.CLASH_PLAYER_TAG;
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
export const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// cache config
export const CACHE_TTL = 2 * 60 * 1000; // 2min
// rate limit config
export const RATE_LIMIT_COUNT = 20; // 20 req/min

export const RATE_LIMIT_WINDOW = 60 * 1000; // 1min window
