#!/usr/bin/env node

/**
 * Development Widget Updater
 * Simple script that calls the update API endpoint every 30 seconds
 * Use this for development only - in production use external cron services
 */

const INTERVAL = 10; // seconds
const ENDPOINT = 'http://localhost:3000/api/cron/update-widgets';

async function updateWidgets() {
  try {
    const response = await fetch(ENDPOINT);
    const data = await response.json();

    console.log(`[${new Date().toISOString()}] Widget update:`, {
      spotify: data.results?.spotify?.updated ?
        `✓ ${data.results.spotify.track}` :
        `↳ ${data.results?.spotify?.reason || data.results?.spotify?.error || 'No change'}`,
      chess: data.results?.chess?.updated ?
        `✓ ${data.results.chess.stats}` :
        `↳ ${data.results?.chess?.reason || data.results?.chess?.error || 'No change'}`,
      clash: data.results?.clash?.updated ?
        `✓ ${data.results.clash.stats}` :
        `↳ ${data.results?.clash?.reason || data.results?.clash?.error || 'No change'}`
    });

    if (data.cleanup) {
      console.log(`  🧹 ${data.cleanup}`);
    }

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Update error:`, error.message);
  }
}

console.log(`🎮 Development Widget Updater Starting...`);
console.log(`   Calling ${ENDPOINT} every ${INTERVAL}s`);
console.log(`   Press Ctrl+C to stop`);
console.log('');

// Initial update
updateWidgets();

// Set up interval
const intervalId = setInterval(updateWidgets, INTERVAL * 1000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development updater...');
  clearInterval(intervalId);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping development updater...');
  clearInterval(intervalId);
  process.exit(0);
});