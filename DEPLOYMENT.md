# DigitalOcean Droplet Setup

This guide covers the deployment steps I did for `willhao.com`.

## 1. Create Droplet

1. In DigitalOcean, click **Create > Droplet**
2. Select **Ubuntu 24.04** + **Node.js 20** one‑click app
3. Add SSH key, name droplet `willhao.com`, click **Create**

## 2. DNS Configuration

1. In domain provider (Point A record to droplet IP)
2. Add A record:

   - **Host:** `@` → **Value:** droplet IP
   - **Host:** `www` → **Value:** droplet IP

3. Wait for propagation (usually <1h)

## 3. Connect & Prepare

```bash
ssh root@<DROPLET_IP>
# Update & essentials
apt update && apt upgrade -y
npm install -g pm2
```

## 4. Deploy App

```bash
cd /opt
git clone https://github.com/williamhao99/willhao.com.git
cd willhao.com
npm install
cp .env.local.example .env.local  # edit with credentials
npm run build
```

## 5. Process Management (PM2)

```bash
pm2 start npm --name willhao.com -- start
pm2 save
pm2 startup systemd  # follow printed instructions
```

## 6. Nginx Reverse Proxy

```bash
apt install -y nginx
cat >/etc/nginx/sites-available/willhao.com << 'EOF'
server {
    listen 80;
    server_name willhao.com www.willhao.com;

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
EOF
ln -s /etc/nginx/sites-available/willhao.com /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

## 7. HTTPS with Certbot

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d willhao.com -d www.willhao.com
```

## 8. Firewall (UFW)

```bash
apt install -y ufw
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

Site is now live, secure, and auto‑managed on server restart.
