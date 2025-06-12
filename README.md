# willhao.info

A personal portfolio website built with Next.js, featuring real-time API widgets and a showcase of my work and experiences.

**Live Site**: [willhao.info](https://willhao.info)

## Pages & Features

### Core Pages

- **Home**: Hero section with real-time widgets and introduction
- **About**: Personal background and information
- **Works**: Portfolio showcasing projects and work experience
- **Blog**: Personal reflections and experiences with archive-style listing
- **Now**: Current activities, learning, and lifestyle updates
- **Timeline**: Chronological milestones and life events

### Interactive Widgets

- **Chess Widget**: Live ratings from Chess.com (Rapid, Blitz, Bullet, USCF)
- **Clash of Clans Widget**: Player stats, trophies, and town hall level
- **Spotify Widget**: Currently playing or recently played tracks with real-time updates

### Design & UX

- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Theme**: System preference detection with manual toggle
- **Modern Navigation**: Clean header with profile photo and wave separators
- **Minimal Footer**: Social links, site navigation, and contact information

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19
- **Styling**: Custom CSS with CSS variables and responsive design
- **APIs**: Chess.com, Clash of Clans, Spotify Web API
- **Security**: Rate limiting, smart caching, centralized config
- **Deployment**: DigitalOcean Droplet (needed a static IP for API calls)

## Code Formatting

This project uses **Prettier** for consistent code formatting across all files:

- **Configuration**: `.prettierrc` and `.prettierignore` files included
- **Auto-formatting**: Configured for JavaScript, JSX, CSS, and Markdown
- **Integration**: Works with most editors

### Prettier Commands
```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

### Editor Setup
For VS Code, install the Prettier extension and enable "Format on Save" in settings.

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/williamhao99/willhao.info.git
   cd willhao.info
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**

   Copy `.env.local.example` to `.env.local` and add your API credentials:
   ```env
   CLASH_API_TOKEN=your_clash_api_token
   CLASH_PLAYER_TAG=your_player_tag
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**

   Visit [http://localhost:3000](http://localhost:3000) to see the site

## API Configuration

### Spotify Setup
1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Run the auth helper to get your refresh token:
   ```bash
   npm run spotify-auth
   ```
3. Follow the instructions to authorize and get your refresh token

### Clash of Clans Setup
1. Get your API token from the [Clash of Clans Developer Portal](https://developer.clashofclans.com/)
2. Find your player tag in-game (Settings → More Settings → copy your tag)

### Chess.com Setup
No API key required, because the Chess.com API is public and rate-limited.

## Security Features

- **Rate Limiting**: 20 requests per minute per IP
- **Smart Caching**: 2-minute cache for API responses
- **Error Handling**: Fallbacks when APIs are unavailable
- **Environment Variables**: Store any sensitive data in .env files

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run spotify-auth # Get Spotify refresh token
```

## License

This is my personal portfolio website. The code is available for viewing only. Please do not copy or redistribute without my permission.

## Contact

**Will Hao**

- Website: [willhao.info](https://willhao.info)
- GitHub: [@williamhao99](https://github.com/williamhao99)
- Email: william.hao.55@gmail.com
