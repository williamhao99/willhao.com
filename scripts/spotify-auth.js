/**
 * Spotify OAuth Helper Script
 *
 * This script helps you get a Spotify refresh token for your application.
 * Run this script and follow the instructions to authorize your application.
 *
 * Usage: node scripts/spotify-auth.js
 */

const http = require("http");
const url = require("url");
const querystring = require("querystring");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
].join("%20");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Error: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env.local",
  );
  process.exit(1);
}

console.log("🎵 Spotify OAuth Helper");
console.log("========================");

// Step 1: Start local server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/callback") {
    const { code, error } = parsedUrl.query;

    if (error) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Error: ${error}</h1>`);
      console.error("Authorization failed:", error);
      server.close();
      return;
    }

    if (code) {
      try {
        // Exchange code for tokens
        const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
            },
            body: querystring.stringify({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: REDIRECT_URI,
            }),
          },
        );

        const tokens = await tokenResponse.json();

        if (tokens.error) {
          throw new Error(tokens.error_description || tokens.error);
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <h1>✅ Success!</h1>
          <p>Authorization complete. You can close this window.</p>
          <p>Check your terminal for the refresh token.</p>
        `);

        console.log("\n✅ Success! Your Spotify refresh token:");
        console.log("=====================================");
        console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log("=====================================");
        console.log("\n📝 Next steps:");
        console.log("1. Copy the refresh token above");
        console.log("2. Update your .env.local file with this token");
        console.log("3. Restart your Next.js development server");
        console.log("\nYour Spotify widget should now work! 🎉");

        server.close();
      } catch (error) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h1>Error getting tokens: ${error.message}</h1>`);
        console.error("Error getting tokens:", error);
        server.close();
      }
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Not Found</h1>");
  }
});

server.listen(8888, "127.0.0.1", () => {
  console.log("1. 🌐 Local server started on http://127.0.0.1:8888");
  console.log("2. 🔗 Opening Spotify authorization URL...");

  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${SCOPES}&` +
    `show_dialog=true`;

  console.log("3. 📱 Please visit this URL in your browser:");
  console.log(`   ${authUrl}`);
  console.log("\n⏳ Waiting for authorization...");

  // Try to open the URL automatically
  const { exec } = require("child_process");
  exec(`open "${authUrl}"`, (error) => {
    if (error) {
      console.log(
        "   (Could not open automatically - please copy the URL above)",
      );
    }
  });
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

process.on("SIGINT", () => {
  console.log("\n👋 Closing server...");
  server.close();
  process.exit(0);
});
