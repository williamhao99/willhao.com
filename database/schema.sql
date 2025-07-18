-- PostgreSQL Schema for willhao.com Widget APIs
-- This file contains the database structure for storing widget data

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chess statistics table
CREATE TABLE chess_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    rapid_rating INTEGER,
    rapid_games_played INTEGER,
    rapid_wins INTEGER,
    rapid_losses INTEGER,
    rapid_draws INTEGER,
    blitz_rating INTEGER,
    blitz_games_played INTEGER,
    blitz_wins INTEGER,
    blitz_losses INTEGER,
    blitz_draws INTEGER,
    bullet_rating INTEGER,
    bullet_games_played INTEGER,
    bullet_wins INTEGER,
    bullet_losses INTEGER,
    bullet_draws INTEGER,
    daily_rating INTEGER,
    daily_games_played INTEGER,
    daily_wins INTEGER,
    daily_losses INTEGER,
    daily_draws INTEGER,
    total_games INTEGER,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spotify activity table
CREATE TABLE spotify_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_name VARCHAR(255),
    artist_name VARCHAR(255),
    album_name VARCHAR(255),
    track_url VARCHAR(500),
    artist_url VARCHAR(500),
    album_image_url VARCHAR(500),
    is_playing BOOLEAN DEFAULT FALSE,
    played_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    progress_ms INTEGER,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clash of Clans statistics table
CREATE TABLE clash_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_tag VARCHAR(20) NOT NULL,
    player_name VARCHAR(100),
    town_hall_level INTEGER,
    experience_level INTEGER,
    trophies INTEGER,
    best_trophies INTEGER,
    war_stars INTEGER,
    attack_wins INTEGER,
    defense_wins INTEGER,
    clan_name VARCHAR(100),
    clan_tag VARCHAR(20),
    clan_role VARCHAR(50),
    league_name VARCHAR(100),
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API request logs for analytics and rate limiting
CREATE TABLE api_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    user_agent TEXT,
    referer VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cache table for external API responses
CREATE TABLE api_cache (
    cache_key VARCHAR(100) PRIMARY KEY,
    data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_chess_stats_username_fetched ON chess_stats(username, fetched_at DESC);
CREATE INDEX idx_spotify_activity_fetched ON spotify_activity(fetched_at DESC);
CREATE INDEX idx_clash_stats_player_fetched ON clash_stats(player_tag, fetched_at DESC);
CREATE INDEX idx_api_requests_ip_timestamp ON api_requests(ip_address, timestamp);
CREATE INDEX idx_api_requests_endpoint_timestamp ON api_requests(endpoint, timestamp);
CREATE INDEX idx_api_cache_expires ON api_cache(expires_at);

-- Views for latest data (most recent entry for each widget)
CREATE VIEW latest_chess_stats AS
SELECT DISTINCT ON (username) *
FROM chess_stats
ORDER BY username, fetched_at DESC;

CREATE VIEW latest_spotify_activity AS
SELECT *
FROM spotify_activity
ORDER BY fetched_at DESC
LIMIT 1;

CREATE VIEW latest_clash_stats AS
SELECT DISTINCT ON (player_tag) *
FROM clash_stats
ORDER BY player_tag, fetched_at DESC;

-- Function to clean up old cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM api_cache WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get rate limit count for an IP
CREATE OR REPLACE FUNCTION get_rate_limit_count(
    check_ip INET,
    window_minutes INTEGER DEFAULT 1
)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM api_requests
        WHERE ip_address = check_ip
        AND timestamp > CURRENT_TIMESTAMP - (window_minutes || ' minutes')::INTERVAL
    );
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old Spotify activity records
-- Keeps only the last 7 days of data by default
CREATE OR REPLACE FUNCTION cleanup_old_spotify_activity(
    days_to_keep INTEGER DEFAULT 7
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM spotify_activity
    WHERE fetched_at < CURRENT_TIMESTAMP - (days_to_keep || ' days')::INTERVAL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to limit total Spotify records (keeps most recent N records)
CREATE OR REPLACE FUNCTION limit_spotify_activity_records(
    max_records INTEGER DEFAULT 1000
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM spotify_activity
    WHERE id NOT IN (
        SELECT id FROM spotify_activity
        ORDER BY fetched_at DESC
        LIMIT max_records
    );
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;