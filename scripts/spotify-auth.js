/**
 * Spotify OAuth helper - mints a new SPOTIFY_REFRESH_TOKEN.
 *
 * Usage: npm run spotify-auth
 *
 * Opens the Spotify consent page, catches the redirect on
 * http://127.0.0.1:8888/callback (the URI registered in the Spotify
 * developer dashboard for this app), exchanges the code for tokens,
 * and writes the new refresh token into .env.local.
 *
 * After it succeeds, update SPOTIFY_REFRESH_TOKEN on the server
 * (/var/www/willhao.com/.env.local) and pm2 restart willhao.com.
 */

const fs = require("fs");
const http = require("http");
const path = require("path");
const { exec } = require("child_process");

const ENV_PATH = path.join(__dirname, "..", ".env.local");
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
].join(" ");

function readEnvFile() {
  const vars = {};
  if (!fs.existsSync(ENV_PATH)) {
    return vars;
  }
  const lines = fs.readFileSync(ENV_PATH, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const eq = line.indexOf("=");
    if (eq < 1 || line.trim().startsWith("#")) continue;
    vars[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return vars;
}

function writeRefreshToken(token) {
  const line = "SPOTIFY_REFRESH_TOKEN=" + token;
  let content = "";
  if (fs.existsSync(ENV_PATH)) {
    content = fs.readFileSync(ENV_PATH, "utf8");
  }
  if (content.includes("SPOTIFY_REFRESH_TOKEN=")) {
    content = content.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line);
  } else {
    if (content.length > 0 && !content.endsWith("\n")) {
      content += "\n";
    }
    content += line + "\n";
  }
  fs.writeFileSync(ENV_PATH, content);
}

const env = readEnvFile();
const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Error: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env.local",
  );
  process.exit(1);
}

async function handleCallback(req, res, server) {
  const parsed = new URL(req.url, "http://127.0.0.1:8888");
  if (parsed.pathname !== "/callback") {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Not Found</h1>");
    return;
  }

  const error = parsed.searchParams.get("error");
  if (error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>Error: " + error + "</h1>");
    console.error("Authorization failed:", error);
    server.close();
    process.exitCode = 1;
    return;
  }

  const code = parsed.searchParams.get("code");
  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>Missing code parameter</h1>");
    return;
  }

  try {
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
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

    writeRefreshToken(tokens.refresh_token);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>Success</h1><p>Authorization complete. You can close this window.</p>",
    );

    console.log("\nSuccess! New refresh token written to .env.local");
    console.log("=================================================");
    console.log("SPOTIFY_REFRESH_TOKEN=" + tokens.refresh_token);
    console.log("=================================================");
    console.log("\nNext steps:");
    console.log("1. Update SPOTIFY_REFRESH_TOKEN on the server:");
    console.log("   /var/www/willhao.com/.env.local");
    console.log("2. pm2 restart willhao.com (as the deploy user)");
    server.close();
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<h1>Error getting tokens: " + err.message + "</h1>");
    console.error("Error getting tokens:", err);
    server.close();
    process.exitCode = 1;
  }
}

const server = http.createServer(function onRequest(req, res) {
  handleCallback(req, res, server);
});

server.listen(8888, "127.0.0.1", function onListen() {
  const authUrl =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" +
    CLIENT_ID +
    "&response_type=code" +
    "&redirect_uri=" +
    encodeURIComponent(REDIRECT_URI) +
    "&scope=" +
    encodeURIComponent(SCOPES) +
    "&show_dialog=true";

  console.log("Listening on http://127.0.0.1:8888");
  console.log("Opening Spotify authorization page...");
  console.log("If the browser does not open, visit:\n\n" + authUrl + "\n");
  console.log("Waiting for authorization...");

  exec('open "' + authUrl + '"', function onOpen(openError) {
    if (openError) {
      console.log("(Could not open browser automatically - use the URL above)");
    }
  });
});

server.on("error", function onServerError(err) {
  console.error("Server error:", err);
  process.exit(1);
});
