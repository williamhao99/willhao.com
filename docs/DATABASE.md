# Database Guide

Complete PostgreSQL setup, maintenance, and management for willhao.com widget APIs.

## 🚀 Quick Setup

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database
```bash
# Connect as postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE willhao_db;
CREATE USER williamhao WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE willhao_db TO williamhao;
\q
```

### 3. Setup Schema
```bash
# From project root
npm run db:setup
```

### 4. Configure Environment
Add to `.env.local`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=willhao_db
DB_USER=williamhao
DB_PASSWORD=your_secure_password
```

## 🏗️ Database Schema

### Core Tables:
- **`chess_stats`** - Chess.com rating history
- **`spotify_activity`** - Spotify listening activity
- **`clash_stats`** - Clash of Clans player stats
- **`api_cache`** - Response caching
- **`api_requests`** - Request logging

### Key Views:
- **`latest_chess_stats`** - Most recent chess ratings
- **`latest_spotify_activity`** - Current Spotify status
- **`latest_clash_stats`** - Current clash stats

### Maintenance Functions:
- **`cleanup_old_spotify_activity(days)`** - Remove old Spotify records
- **`limit_spotify_activity_records(max)`** - Keep only recent N records
- **`cleanup_expired_cache()`** - Remove expired cache entries

## 📊 Essential Queries

### Quick Health Check
```sql
-- Database size and table counts
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  (SELECT COUNT(*) FROM pg_class WHERE relname = tablename) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Widget Data Status
```sql
-- Current widget data freshness
SELECT
  'Chess' as widget,
  username as identifier,
  rapid_rating as current_value,
  fetched_at as last_update
FROM latest_chess_stats
UNION ALL
SELECT
  'Spotify' as widget,
  COALESCE(track_name, 'No Activity') as identifier,
  CASE WHEN is_playing THEN 'Playing' ELSE 'Paused' END as current_value,
  fetched_at as last_update
FROM latest_spotify_activity
UNION ALL
SELECT
  'Clash' as widget,
  player_name as identifier,
  trophies::text as current_value,
  fetched_at as last_update
FROM latest_clash_stats;
```

### API Performance
```sql
-- API performance last 24 hours
SELECT
  endpoint,
  COUNT(*) as requests,
  ROUND(AVG(response_time_ms)) as avg_ms,
  MAX(response_time_ms) as max_ms,
  COUNT(CASE WHEN status_code = 200 THEN 1 END)::float / COUNT(*) * 100 as success_rate
FROM api_requests
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY endpoint
ORDER BY requests DESC;
```

## 🧹 Maintenance Tasks

### Daily Cleanup (Automated)
```sql
-- Clean old Spotify records (keeps last 7 days)
SELECT cleanup_old_spotify_activity(7);

-- Limit Spotify records (keeps last 1000)
SELECT limit_spotify_activity_records(1000);

-- Clean expired cache
SELECT cleanup_expired_cache();
```

### Manual Cleanup
```sql
-- Remove old API request logs (older than 30 days)
DELETE FROM api_requests WHERE timestamp < NOW() - INTERVAL '30 days';

-- Remove orphaned cache entries
DELETE FROM api_cache WHERE expires_at < NOW() - INTERVAL '1 day';

-- Vacuum tables (reclaim space)
VACUUM ANALYZE;
```

### Data Analysis
```sql
-- Chess rating trends (last 30 days)
SELECT
  DATE(fetched_at) as date,
  rapid_rating,
  blitz_rating
FROM chess_stats
WHERE fetched_at > NOW() - INTERVAL '30 days'
ORDER BY fetched_at DESC;

-- Spotify listening patterns
SELECT
  artist_name,
  COUNT(*) as plays,
  COUNT(DISTINCT track_name) as unique_tracks
FROM spotify_activity
WHERE fetched_at > NOW() - INTERVAL '7 days'
GROUP BY artist_name
ORDER BY plays DESC
LIMIT 10;

-- Clash progress tracking
SELECT
  DATE(fetched_at) as date,
  trophies,
  town_hall_level
FROM clash_stats
ORDER BY fetched_at DESC
LIMIT 30;
```

## 🔧 Useful Commands

### Connection & Status
```bash
# Connect to database
psql -d willhao_db

# Quick status check
psql -d willhao_db -c "SELECT NOW();"

# Check database size
psql -d willhao_db -c "SELECT pg_size_pretty(pg_database_size('willhao_db'));"

# List all tables
psql -d willhao_db -c "\dt"
```

### Backup & Restore
```bash
# Create backup
pg_dump willhao_db > willhao_db_backup.sql

# Restore from backup
psql -d willhao_db < willhao_db_backup.sql

# Compressed backup
pg_dump willhao_db | gzip > willhao_db_backup.sql.gz
```

### Reset Database
```bash
# Complete reset (WARNING: Deletes all data!)
npm run db:reset

# Or manually:
dropdb willhao_db && createdb willhao_db && npm run db:setup
```

## 🚀 Production Setup

### DigitalOcean Deployment
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Configure authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Change: local all all peer → local all all md5

# Create database
sudo -u postgres psql
CREATE DATABASE willhao_db;
CREATE USER williamhao WITH PASSWORD 'secure_production_password';
GRANT ALL PRIVILEGES ON DATABASE willhao_db TO williamhao;
\q

# Setup schema
psql -d willhao_db -f database/schema.sql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Security
```bash
# Set password for postgres user
sudo -u postgres psql -c "\password postgres"

# Configure firewall (if needed)
sudo ufw allow 5432/tcp
```

## 🐛 Troubleshooting

### Common Issues
```bash
# PostgreSQL not running
sudo systemctl status postgresql
sudo systemctl start postgresql

# Connection refused
psql -h localhost -p 5432 -U williamhao -d willhao_db

# Permission denied
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE willhao_db TO williamhao;"

# Check logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Database Recovery
```sql
-- Check for corruption
SELECT * FROM pg_stat_database WHERE datname = 'willhao_db';

-- Reindex if needed
REINDEX DATABASE willhao_db;

-- Analyze statistics
ANALYZE;
```

## 📈 Monitoring & Alerts

### Performance Monitoring
```sql
-- Slow queries (if query logging enabled)
SELECT
  query,
  mean_time,
  calls,
  total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Connection count
SELECT count(*) FROM pg_stat_activity;

-- Database activity
SELECT * FROM pg_stat_database WHERE datname = 'willhao_db';
```

### Health Checks
```bash
# Quick health script
#!/bin/bash
echo "=== Database Health Check ==="
psql -d willhao_db -c "SELECT NOW() as timestamp;"
psql -d willhao_db -c "SELECT COUNT(*) as widget_apis FROM (SELECT 1 FROM latest_chess_stats UNION SELECT 1 FROM latest_spotify_activity UNION SELECT 1 FROM latest_clash_stats) t;"
echo "=== End Health Check ==="
```

The database is designed to be **self-maintaining** with automatic cleanup functions and efficient indexing for optimal performance.