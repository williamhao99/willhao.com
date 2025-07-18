# Website Management Cheatsheet

**Server IP Address:** 143.244.223.171
**Project Directory:** /root/willhao.info
**PM2 App Name:** willhao-info
**Database:** PostgreSQL willhao_db

---

## Connecting to the Droplet

```bash
ssh root@143.244.223.171
```

---

## Updating the Website (Standard Workflow)

> Use these steps every time you push new code to your GitHub repository.

1. **Go to your project folder**
   ```bash
   cd willhao.com
   ```
2. **Pull the latest code**
   ```bash
   git pull
   ```
3. **Install/update dependencies**
   *(Safe to run every time; only changes when `package.json` does.)*
   ```bash
   npm install
   ```
4. **Check database status**
   *(Quick health check before deploying)*
   ```bash
   psql -d willhao_db -c "SELECT COUNT(*) FROM api_requests WHERE timestamp > NOW() - INTERVAL '1 hour';"
   ```
5. **Rebuild the application**
   *(CRITICAL after any code change)*
   ```bash
   npm run build
   ```
6. **Reload via PM2 (zero-downtime)**
   ```bash
   pm2 reload willhao-info
   ```
7. **Verify APIs are working**
   ```bash
   curl -I http://localhost:3000/api/chess | grep "HTTP\|x-data-source"
   curl -I http://localhost:3000/api/spotify | grep "HTTP\|x-data-source"
   curl -I http://localhost:3000/api/clash | grep "HTTP\|x-data-source"
   ```

---

## Database Management (PostgreSQL)

### **Quick Database Status**
```bash
# Connect to database
psql -d willhao_db

# Quick health check
psql -d willhao_db -c "SELECT 'Chess: ' || COUNT(*) FROM chess_stats; SELECT 'Spotify: ' || COUNT(*) FROM spotify_activity; SELECT 'API Calls: ' || COUNT(*) FROM api_requests WHERE timestamp > NOW() - INTERVAL '24 hours';"

# Check database size
psql -d willhao_db -c "SELECT pg_size_pretty(pg_database_size('willhao_db')) as database_size;"
```

### **Daily Maintenance**
```bash
# Clean expired cache
psql -d willhao_db -c "SELECT cleanup_expired_cache() as deleted_entries;"

# Check API performance (last 24 hours)
psql -d willhao_db -c "SELECT endpoint, COUNT(*) as requests, ROUND(AVG(response_time_ms)) as avg_ms FROM api_requests WHERE timestamp > NOW() - INTERVAL '24 hours' GROUP BY endpoint;"

# Vacuum database (weekly)
psql -d willhao_db -c "VACUUM ANALYZE;"
```

### **Database Backup & Restore**
```bash
# Create backup
pg_dump willhao_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -d willhao_db < backup_20250718_120000.sql

# Automated daily backup (add to crontab)
echo "0 2 * * * pg_dump willhao_db > /root/backups/willhao_db_$(date +\%Y\%m\%d).sql" | crontab -
```

### **Emergency Database Commands**
```bash
# If database is locked/stuck
psql -d willhao_db -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'willhao_db' AND pid != pg_backend_pid();"

# Check for database issues
psql -d willhao_db -c "SELECT schemaname, tablename, n_dead_tup as dead_tuples FROM pg_stat_user_tables WHERE n_dead_tup > 100 ORDER BY dead_tuples DESC;"

# Emergency read-only mode
psql -d willhao_db -c "ALTER DATABASE willhao_db SET default_transaction_read_only = on;"
```

---

## Widget API Monitoring

### **Real-Time Monitoring**
```bash
# Check current API status
curl -s http://localhost:3000/api/chess | jq '.lastUpdated'
curl -s http://localhost:3000/api/spotify | jq '.track_name'
curl -s http://localhost:3000/api/clash | jq '.trophies'

# Monitor cache performance
psql -d willhao_db -c "SELECT cache_key, CASE WHEN expires_at > NOW() THEN 'VALID' ELSE 'EXPIRED' END as status FROM api_cache;"

# Watch logs in real-time
pm2 logs willhao-info --lines 20
```

### **Performance Analytics**
```bash
# API response times (last hour)
psql -d willhao_db -c "SELECT endpoint, ROUND(AVG(response_time_ms)) as avg_ms, MIN(response_time_ms) as min_ms, MAX(response_time_ms) as max_ms FROM api_requests WHERE timestamp > NOW() - INTERVAL '1 hour' GROUP BY endpoint;"

# Most active users/IPs
psql -d willhao_db -c "SELECT ip_address, COUNT(*) as requests FROM api_requests WHERE timestamp > NOW() - INTERVAL '24 hours' GROUP BY ip_address ORDER BY requests DESC LIMIT 5;"

# Error tracking
psql -d willhao_db -c "SELECT endpoint, status_code, COUNT(*) as errors FROM api_requests WHERE status_code >= 400 AND timestamp > NOW() - INTERVAL '24 hours' GROUP BY endpoint, status_code ORDER BY errors DESC;"
```

---

## System Updates (Ubuntu Security & Package Upgrades)

> Keep your OS and packages up-to-date before you deploy any changes.

1. **Refresh package lists**
   ```bash
   apt update
   ```
2. **Install available upgrades**
   ```bash
   apt upgrade -y
   ```
3. *(Optional)* **Allow full upgrades**
   ```bash
   apt full-upgrade -y
   ```
4. **Clean up unused packages**
   ```bash
   apt autoremove -y
   ```
5. **Check PostgreSQL after updates**
   ```bash
   systemctl status postgresql
   psql -d willhao_db -c "SELECT NOW();"
   ```
6. **Reboot if prompted**
   ```bash
   reboot
   ```

---

## Managing Your Live Application (PM2)

```bash
# See status, CPU/memory, uptime
pm2 status

# Tail logs in real time
pm2 logs willhao-info

# Restart (full restart)
pm2 restart willhao-info

# Stop (keeps it in PM2 list)
pm2 stop willhao-info

# Start (after stopping)
pm2 start willhao-info

# Monitor resource usage
pm2 monit
```

---

## Managing PostgreSQL Service

```bash
# Check PostgreSQL status
systemctl status postgresql

# Start/stop PostgreSQL
systemctl start postgresql
systemctl stop postgresql
systemctl restart postgresql

# Enable PostgreSQL on boot
systemctl enable postgresql

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-*.log
```

---

## Managing the Web Server (Nginx)

> Only needed if you change `nginx.conf` or any site config.

```bash
# Test for syntax errors
sudo nginx -t

# Reload new config
sudo systemctl restart nginx

# Check Nginx status
systemctl status nginx

# View Nginx access logs
tail -f /var/log/nginx/access.log

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Managing the Droplet Itself

```bash
# Check system resources
htop
df -h
free -h

# Check disk space (database can grow!)
du -sh /var/lib/postgresql/

# Reboot the server (automatically restarts PM2 apps and PostgreSQL)
reboot

# Shut down the server
shutdown now
```

---

## Production Database Setup (One-Time)

> Only needed when setting up database on production server for the first time.

```bash
# Install PostgreSQL
apt update && apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres psql
CREATE DATABASE willhao_db;
CREATE USER willhao_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE willhao_db TO willhao_user;
\q

# Run database schema
psql -d willhao_db -f database/schema.sql

# Update environment variables
echo "DB_PASSWORD=your_secure_password" >> .env.local
```

---

## Troubleshooting Common Issues

### **Website Won't Load**
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs willhao-info --lines 50

# Check Nginx
systemctl status nginx
nginx -t

# Check database connection
psql -d willhao_db -c "SELECT NOW();"
```

### **Database Issues**
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Check database connections
psql -d willhao_db -c "SELECT count(*) FROM pg_stat_activity;"

# Check database size (if disk full)
psql -d willhao_db -c "SELECT pg_size_pretty(pg_database_size('willhao_db'));"
```

### **API Performance Issues**
```bash
# Check recent API errors
psql -d willhao_db -c "SELECT endpoint, status_code, response_time_ms, timestamp FROM api_requests WHERE status_code >= 400 ORDER BY timestamp DESC LIMIT 10;"

# Check slow API responses
psql -d willhao_db -c "SELECT endpoint, response_time_ms, timestamp FROM api_requests WHERE response_time_ms > 5000 ORDER BY timestamp DESC LIMIT 10;"
```

---

### (Optional) Auto-Installing Security Updates

1. **Install unattended-upgrades**
   ```bash
   apt install unattended-upgrades -y
   ```
2. **Enable/configure it**
   ```bash
   dpkg-reconfigure --priority=low unattended-upgrades
   ```
This will apply security fixes automatically in the background.

---

## Emergency Contacts & Resources

- **Database Cheatsheet**: See `database/MAINTENANCE.md` for detailed PostgreSQL commands
- **Server Monitoring**: `htop`, `pm2 monit`, `systemctl status`
- **Log Locations**:
  - Application: `pm2 logs willhao-info`
  - Nginx: `/var/log/nginx/`
  - PostgreSQL: `/var/log/postgresql/`
- **Backup Location**: `/root/backups/` (create if needed)
