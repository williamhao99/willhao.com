# willhao.com

My personal portfolio website built with Next.js.

**Live Site:** [willhao.com](https://willhao.com)

**Alternate Domain (Redirect):** [willhao.info](https://willhao.info)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup](#setup)
5. [Deployment](#deployment)
6. [Security](#security)
7. [Contact](#contact)

---

## Overview

A clean, responsive Next.js site with:

- Hero section and about pages
- Portfolio and blog
- "Now" page
- Real‑time widgets (Chess.com, Clash of Clans, Spotify)
- SEO‑friendly metadata and analytics

## Features

- **Responsive Design:** Mobile-friendly, CSS variables, persistent dark/light theme toggle
- **Widgets:** Live API data for chess, gaming, and music, with detailed Spotify integration (time-ago display, overflow scrolling)
- **Performance:** Optimized component architecture, modular CSS
- **SEO & Sharing:** OpenGraph, Twitter Cards, JSON‑LD, dynamic sitemap, robots.txt
- **Analytics:** GA4 via Google Tag Manager

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, modular CSS with a global base file
- **Data:** Chess.com API, Clash of Clans API, Spotify Web API
- **Analytics & SEO:** GA4, GTM, structured data, dynamic sitemap, robots.txt
- **Deployment:** DigitalOcean Droplet, Nginx, PM2, Certbot

## Setup

1. **Clone repo**

   ```bash
   git clone https://github.com/williamhao99/willhao.com.git
   cd willhao.com
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env.local` in the project root with the required keys:

   - `CLASH_API_TOKEN`
   - `CLASH_PLAYER_TAG`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`

   Optional: use the script to obtain the Spotify refresh token

   ```bash
   npm run spotify-auth
   ```

4. **Run in development**

   ```bash
   npm run dev
   ```

5. **Visit** [http://localhost:3000](http://localhost:3000)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full server setup instructions.

## Security

- **Rate Limiting:** 100 req/min per IP with shared in-memory rate limiter
- **Caching:** Smart cache for API calls with timeouts and short cache headers
- **Error Handling:** localStorage, JSON parsing, and API call error handling
- **Environment Variables:** Sensitive tokens in `.env.local`

## Contact

**Will Hao**

- GitHub: [@williamhao99](https://github.com/williamhao99)
- Email: [william.hao.55@gmail.com](mailto:william.hao.55@gmail.com)

---
