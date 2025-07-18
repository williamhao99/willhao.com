# willhao.com

My personal portfolio website built with Next.js and PostgreSQL.

**Live Site:** [willhao.com](https://willhao.com)

**Alternate Domain (Redirect):** [willhao.info](https://willhao.info)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup](#setup)
5. [Documentation](#documentation)
6. [Contact](#contact)

---

## Overview

A modern, data-driven Next.js portfolio website featuring:

- Hero section and about pages
- Portfolio and blog with dynamic content
- "Now" page with real-time updates
- Real‑time widgets (Chess.com, Clash of Clans, Spotify) with database-first architecture
- Ultra-fast API responses with background data updates
- Historical data tracking and analytics

## Features

- **Responsive Design:** Mobile‑first, CSS variables, dark/light toggle
- **Database-First APIs:** Ultra-fast responses (<50ms) with background updates
- **PostgreSQL Database:** Persistent data storage with historical tracking
- **No Rate Limits:** Unlimited concurrent requests on all widget APIs
- **Multi-layer Caching:** Smart caching with automatic cleanup
- **SEO & Sharing:** OpenGraph, Twitter Cards, JSON‑LD, dynamic sitemap, robots.txt
- **Analytics:** GA4 via Google Tag Manager

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, CSS with CSS variables
- **Database:** PostgreSQL 15 with connection pooling
- **APIs:** Chess.com API, Clash of Clans API, Spotify Web API
- **Background Processing:** Unified widget updater (30s intervals)
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

3. **Set up database**

   ```bash
   # Install PostgreSQL, then:
   createdb willhao_db
   psql -d willhao_db -f database/schema.sql
   ```

4. **Configure environment**

   ```bash
   cp .env.local.example .env.local
   # Add API keys and database credentials
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Start widget updater** (in separate terminal for real-time updates)

   ```bash
   npm run dev:updater
   ```

7. **Visit** [http://localhost:3000](http://localhost:3000)

## Documentation

Complete technical documentation is available in the [`docs/`](./docs/) folder:

- **[Architecture Overview](./docs/WIDGET_ARCHITECTURE.md)** - System architecture and design
- **[Database Setup](./docs/DATABASE.md)** - Database schema and configuration
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Website Management](./docs/WEBSITE_MANAGEMENT.md)** - Operations and maintenance

## Contact

**Will Hao**

- Website: [willhao.com](https://willhao.com)
- GitHub: [@williamhao99](https://github.com/williamhao99)
- LinkedIn: [william-a-hao](https://www.linkedin.com/in/william-a-hao/)
