# DigitalOcean Deployment Setup

This guide walks you through setting up your website on a DigitalOcean droplet from scratch.

## 📋 Prerequisites

- DigitalOcean droplet with Ubuntu 20.04+ LTS
- Domain name pointed to your droplet's IP
- SSH access to your droplet

## 🚀 Initial Server Setup

### 1. Connect to Your Droplet
```bash
ssh root@your-droplet-ip
```

### 2. Create Non-Root User (if not done)
```bash
adduser williamhao
usermod -aG sudo williamhao
su - williamhao
```

### 3. Install System Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install nginx -y

# Install jq for JSON parsing
sudo apt install jq -y
```

## 🗄️ Database Setup

### 1. Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user (in psql)
CREATE DATABASE willhao_db;
CREATE USER williamhao WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE willhao_db TO williamhao;
\q
```

### 2. Update PostgreSQL Authentication
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Change this line:
# local   all             all                                     peer
# To:
# local   all             all                                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## 📁 Project Deployment

### 1. Clone Your Repository
```bash
cd ~
git clone https://github.com/your-username/willhao.com.git
cd willhao.com
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy the DigitalOcean environment file
cp .env.local.digitalocean .env.local

# Edit database password (update the empty DB_PASSWORD)
nano .env.local
```
Update the database configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=willhao_db
DB_USER=williamhao
DB_PASSWORD=your_secure_password  # Add the password you set above
```

### 4. Initialize Database Schema
```bash
# Run the database setup
npm run db:setup
```

### 5. Build the Application
```bash
npm run build
```

## 🔄 Background Widget Updates

Since your APIs are database-first, you need a service to keep the data fresh. You have two main options:

### Option 1: External Cron Service (Recommended)

#### **Uptime Robot** (Free & Reliable)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create account → Add Monitor
3. **URL**: `https://your-domain.com/api/cron/update-widgets`
4. **Type**: HTTP(s)
5. **Interval**: 30 seconds or 1 minute
6. **Done!** ✅

This is the cleanest approach - no server processes to manage.

### Option 2: Server Cron Job

```bash
# Edit crontab
crontab -e

# Add this line to update every minute:
* * * * * curl -s http://localhost:3000/api/cron/update-widgets > /dev/null 2>&1
```

## 🚀 Process Management with PM2

### 1. Start Your Application
```bash
# Start the app with PM2
pm2 start npm --name "willhao-web" -- start

# Save PM2 configuration
pm2 save

# Enable PM2 startup script
pm2 startup
# Follow the instructions it provides
```

### 2. Monitor Your Application
```bash
# View logs
pm2 logs willhao-web

# Check status
pm2 status

# Restart if needed
pm2 restart willhao-web
```

## 🌐 Nginx Reverse Proxy

### 1. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/willhao.com
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable the Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/willhao.com /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## 🔒 SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔄 Deployment Updates

When you push new code to GitHub:

```bash
# SSH into your droplet
ssh williamhao@your-droplet-ip

# Navigate to project
cd ~/willhao.com

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart the application
pm2 restart willhao-web
```

## ✅ Verification Checklist

After setup, verify everything works:

1. **Database Connection**: `psql -d willhao_db -c "SELECT NOW();"`
2. **API Endpoints**:
   - `curl http://localhost:3000/api/spotify`
   - `curl http://localhost:3000/api/chess`
   - `curl http://localhost:3000/api/clash`
3. **Widget Updates**: `curl http://localhost:3000/api/cron/update-widgets`
4. **Website**: Visit `https://your-domain.com`
5. **SSL**: Check the lock icon in browser

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Check logs
   sudo tail -f /var/log/postgresql/postgresql-*-main.log
   ```

2. **PM2 App Not Starting**
   ```bash
   # Check logs
   pm2 logs willhao-web

   # Check environment
   pm2 show willhao-web
   ```

3. **Widget Data Not Updating**
   - Verify external cron service is hitting your endpoint
   - Check API logs: `pm2 logs willhao-web | grep cron`
   - Manually test: `curl http://localhost:3000/api/cron/update-widgets`

## 📝 Summary

After this setup:

- ✅ **Your APIs** (`/api/spotify`, `/api/chess`, `/api/clash`) will always work and serve data from PostgreSQL
- ✅ **Widget data** stays fresh via external cron service (Uptime Robot recommended)
- ✅ **No scripts to maintain** - everything runs automatically
- ✅ **Fast, reliable, production-ready** deployment

The architecture is clean: external service calls your update endpoint → updates database → your APIs serve from database. Perfect! 🎉