# Widget System Architecture & Updates

Complete guide to the unified widget system for willhao.com including architecture, updates, and maintenance.

## 🏗️ System Architecture

### Database-First Design
All widget APIs use a **database-first architecture**:
- **Public APIs** (`/api/spotify`, `/api/chess`, `/api/clash`) **always serve from PostgreSQL**
- **Background updater** fetches from external APIs and updates database
- **No rate limiting** on public APIs - unlimited concurrent requests
- **Fast responses** - typically <50ms from database

### Components

#### 1. Public API Routes
All APIs follow the same pattern:
- **Always serve from database** - no external API calls
- **Fast responses** - typically <50ms
- **Cache enabled** - 30-second cache for extra speed
- **Graceful fallbacks** - return last known data if database empty

**Available endpoints:**
- `/api/spotify` - Current/recent Spotify track
- `/api/chess` - Chess.com ratings (rapid, blitz, bullet)
- `/api/clash` - Clash of Clans stats (trophies, town hall)

#### 2. Update System
- **Single API endpoint**: `/api/cron/update-widgets`
- **Parallel processing** of all external APIs
- **Smart storage** - only saves when data changes
- **Automatic cleanup** - prevents database bloat
- **External triggering** - called by cron services

#### 3. Database Layer
- **PostgreSQL** with optimized schema
- **Historical tracking** of all widget data
- **Automatic cleanup** functions
- **Efficient indexing** for fast queries

## 🔄 Update System

### API Endpoint

**`/api/cron/update-widgets`**
- **Method**: `GET`
- **Purpose**: Updates all widget data in parallel
- **Response time**: ~500-1000ms
- **Frequency**: Every 30 seconds (recommended)

**Example Response**:
```json
{
  "success": true,
  "timestamp": "2025-07-18T20:53:31.367Z",
  "duration": 576,
  "results": {
    "spotify": {
      "updated": true,
      "track": "Song Name by Artist Name"
    },
    "chess": {
      "updated": true,
      "stats": "Rapid 2214, Blitz 2110"
    },
    "clash": {
      "updated": true,
      "stats": "TH17, 4734 trophies"
    }
  },
  "cleanup": "Cleaned up 5 old records"
}
```

## 🚀 Setup Options

### For Development (Local)

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start development updater
npm run dev:updater
```

The dev updater automatically calls the API endpoint every 30 seconds.

### For Production (Choose One)

#### **Option 1: Uptime Robot** (Recommended - Free & Reliable)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Create a new monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-domain.com/api/cron/update-widgets`
   - **Interval**: 30 seconds

#### **Option 2: Server Cron Job**
```bash
# Edit crontab
crontab -e

# Add these lines for every 30 seconds
* * * * * curl -s https://your-domain.com/api/cron/update-widgets > /dev/null
* * * * * sleep 30 && curl -s https://your-domain.com/api/cron/update-widgets > /dev/null
```

#### **Option 3: GitHub Actions** (Free for public repos)
```yaml
# .github/workflows/update-widgets.yml
name: Update Widgets
on:
  schedule:
    - cron: '*/1 * * * *'  # Every minute (minimum for GitHub Actions)

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Update widgets
        run: curl https://your-domain.com/api/cron/update-widgets
```

## ⚡ Performance Features

### Smart Updates
- **Change detection** - only stores data when values change
- **Parallel processing** - all APIs updated simultaneously
- **Error isolation** - one API failure doesn't affect others
- **Efficient queries** - optimized database access

### Automatic Cleanup
- **1% chance per update** to run cleanup
- **Keeps 7 days** of Spotify listening history
- **Limits records** to prevent database bloat
- **Removes expired cache** entries

### Caching Strategy
- **Database cache** - 30-second cache for API responses
- **Smart invalidation** - cache cleared when data updates
- **Fallback support** - serves stale data if needed

## 🔧 Manual Operations

### Testing Updates
```bash
# Test the update endpoint
curl http://localhost:3000/api/cron/update-widgets

# Test specific APIs
curl http://localhost:3000/api/spotify
curl http://localhost:3000/api/chess
curl http://localhost:3000/api/clash

# Check response with formatting
npm run update-widgets
```

### Database Maintenance
```bash
# Connect to database
psql -d willhao_db

# Check current widget status
SELECT * FROM latest_spotify_activity;
SELECT * FROM latest_chess_stats;
SELECT * FROM latest_clash_stats;

# Manual cleanup (if needed)
SELECT cleanup_old_spotify_activity(7);
SELECT limit_spotify_activity_records(1000);
```

## 🐛 Error Handling

The system gracefully handles various error scenarios:

### Individual API Failures
```json
{
  "success": true,
  "results": {
    "spotify": { "updated": true, "track": "Song Name" },
    "chess": { "error": "Chess.com API timeout" },
    "clash": { "updated": false, "reason": "Same stats" }
  }
}
```

### Complete System Status
- **Public APIs always work** - serve from database
- **Updates may fail occasionally** - external APIs are unreliable
- **Data persists** - last known good data always available
- **Self-healing** - next successful update fixes any issues

## 📊 Monitoring

### Health Checks
```bash
# Quick system health
curl -s http://localhost:3000/api/spotify | jq '.lastUpdated'
curl -s http://localhost:3000/api/cron/update-widgets | jq '.success'

# Database health
psql -d willhao_db -c "SELECT COUNT(*) FROM (SELECT 1 FROM latest_chess_stats UNION SELECT 1 FROM latest_spotify_activity UNION SELECT 1 FROM latest_clash_stats) t;"
```

### Key Metrics
- **API response time** - should be <50ms for public APIs
- **Update frequency** - should update every 30 seconds
- **Success rate** - should be >95% for updates
- **Data freshness** - widgets should show recent data

## 🔄 Migration History

### ❌ Removed (Old Architecture)
- `scripts/update-all-widgets.js`
- `scripts/start-widget-updater.sh`
- `scripts/update-spotify.js`
- `scripts/start-spotify-updater.sh`
- `scripts/cleanup-database.js`
- Rate limiting on public APIs
- External API calls from public endpoints

### ✅ Current Architecture
- Single update endpoint: `/api/cron/update-widgets`
- Database-first public APIs
- External cron service triggers updates
- No background processes to manage
- Built into Next.js application

## 🎯 Benefits

### For Development
- **Simple setup** - just `npm run dev:updater`
- **Easy debugging** - standard HTTP responses
- **Fast iteration** - no separate processes
- **Real-time updates** - immediate feedback

### For Production
- **Reliable updates** - external service monitoring
- **Scalable** - handles unlimited API requests
- **Maintainable** - no complex background processes
- **Monitorable** - built-in status reporting

### For Users
- **Fast loading** - APIs respond instantly
- **Always available** - no rate limit errors
- **Real-time data** - updates every 30 seconds
- **Consistent experience** - reliable performance

The widget system is designed to be **self-maintaining**, **highly performant**, and **production-ready** with minimal operational overhead.