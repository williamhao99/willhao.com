/**
 * Spotify OAuth helper - mints a new SPOTIFY_REFRESH_TOKEN, end to end.
 *
 * Usage: npm run spotify-auth
 *
 * Opens the Spotify consent page, catches the redirect on
 * http://127.0.0.1:8888/callback (the URI registered in the Spotify
 * developer dashboard for this app), exchanges the code for tokens,
 * writes the new refresh token into .env.local, deploys it to the
 * production server over SSH (one passphrase prompt), restarts PM2,
 * verifies the live site is serving data on the new token, and opens
 * a calendar reminder for the next re-auth (~6 months out - Spotify
 * refresh tokens hard-expire 6 months after authorization).
 *
 * If the SSH deploy fails, the local token is kept and the manual
 * steps are printed; the server keeps running on the old token.
 */

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { exec, spawnSync } = require("child_process");

const ENV_PATH = path.join(__dirname, "..", ".env.local");
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
].join(" ");

// VM details live in .env.local, not here - this file is tracked by git:
// VM_SSH_TARGET=user@host  VM_ENV_PATH=/path/to/.env.local  VM_PM2_APP=name
const LIVE_URL = "https://willhao.com/api/spotify";

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

function printManualSteps(token) {
  let envPath = VM_ENV_PATH;
  if (!envPath) {
    envPath = "<the server .env.local>";
  }
  let pm2App = VM_PM2_APP;
  if (!pm2App) {
    pm2App = "<the pm2 app>";
  }
  console.log("\nManual deploy steps:");
  console.log("=================================================");
  console.log("SPOTIFY_REFRESH_TOKEN=" + token);
  console.log("=================================================");
  console.log("1. Update SPOTIFY_REFRESH_TOKEN in " + envPath + " on the server");
  console.log("2. Restart the app: su - deploy -c 'pm2 restart " + pm2App + "'");
  console.log("(The server keeps running on the old token until then.)");
}

// One ssh invocation (one passphrase prompt): verify env, swap token,
// verify the write, restart PM2 as the deploy user
function deployToServer(token) {
  if (!VM_SSH_TARGET || !VM_ENV_PATH || !VM_PM2_APP) {
    console.log(
      "\nVM_SSH_TARGET / VM_ENV_PATH / VM_PM2_APP not set in .env.local - skipping auto-deploy.",
    );
    return false;
  }
  if (
    !/^[A-Za-z0-9._@-]+$/.test(VM_SSH_TARGET) ||
    !/^[A-Za-z0-9/._-]+$/.test(VM_ENV_PATH) ||
    !/^[A-Za-z0-9._-]+$/.test(VM_PM2_APP)
  ) {
    console.error("VM_* values have unexpected characters - skipping auto-deploy.");
    return false;
  }
  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    console.error("Token has unexpected characters - not deploying via sed.");
    return false;
  }

  const remoteScript =
    "set -e\n" +
    "grep -q '^SPOTIFY_REFRESH_TOKEN=' " + VM_ENV_PATH + "\n" +
    "sed -i 's|^SPOTIFY_REFRESH_TOKEN=.*|SPOTIFY_REFRESH_TOKEN=" + token + "|' " + VM_ENV_PATH + "\n" +
    "grep -q '^SPOTIFY_REFRESH_TOKEN=" + token + "$' " + VM_ENV_PATH + "\n" +
    "su - deploy -c 'pm2 restart " + VM_PM2_APP + "'\n" +
    "echo DEPLOY_OK\n";

  console.log("\nDeploying to " + VM_SSH_TARGET + " (ssh may prompt for your key passphrase)...");
  const result = spawnSync("ssh", [VM_SSH_TARGET, "bash -s"], {
    input: remoteScript,
    stdio: ["pipe", "pipe", "inherit"],
    encoding: "utf8",
    timeout: 120000,
  });

  if (result.status !== 0 || !String(result.stdout).includes("DEPLOY_OK")) {
    console.error("SSH deploy failed (exit " + result.status + ").");
    return false;
  }
  console.log("Server env updated, PM2 restarted.");
  return true;
}

function sleep(ms) {
  return new Promise(function resolveLater(resolve) {
    setTimeout(resolve, ms);
  });
}

// Poll the live site until it serves real data on the new token
async function verifyLive() {
  console.log("Verifying " + LIVE_URL + " ...");
  for (let attempt = 0; attempt < 30; attempt++) {
    await sleep(3000);
    try {
      const response = await fetch(LIVE_URL, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (data.songTitle && data.songTitle !== "—" && !data.backoff) {
          let status = "Last played";
          if (data.isPlaying) {
            status = "Now playing";
          }
          console.log(
            "Live and healthy: " + status + " " + data.songTitle + " - " + data.artist,
          );
          return;
        }
      }
    } catch {
      // Server restarting - keep polling
    }
  }
  console.log(
    "Could not confirm live data within 90s. Token IS deployed - check " +
      LIVE_URL +
      " manually (Spotify itself may be slow or down).",
  );
}

function pad2(n) {
  if (n < 10) {
    return "0" + n;
  }
  return String(n);
}

function icsDate(d) {
  return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate());
}

// Refresh tokens hard-expire 6 months after authorization (Spotify policy
// since Jun 2026) - drop a calendar reminder 2 weeks before that
function createReauthReminder() {
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 6);
  const remind = new Date(expiry.getTime() - 14 * 86400000);
  const remindEnd = new Date(remind.getTime() + 86400000);
  const expiryLabel = expiry.toDateString();

  const ics =
    "BEGIN:VCALENDAR\r\n" +
    "VERSION:2.0\r\n" +
    "PRODID:-//willhao.com//spotify-auth//EN\r\n" +
    "BEGIN:VEVENT\r\n" +
    "UID:spotify-reauth-" + Date.now() + "@willhao.com\r\n" +
    "DTSTAMP:" + icsDate(new Date()) + "T000000Z\r\n" +
    "DTSTART;VALUE=DATE:" + icsDate(remind) + "\r\n" +
    "DTEND;VALUE=DATE:" + icsDate(remindEnd) + "\r\n" +
    "SUMMARY:Spotify re-auth - run npm run spotify-auth\r\n" +
    "DESCRIPTION:Refresh token expires around " + expiryLabel +
    " (6 months after authorization). Run npm run spotify-auth in the willhao.com repo.\r\n" +
    "END:VEVENT\r\n" +
    "END:VCALENDAR\r\n";

  const icsPath = path.join(os.tmpdir(), "spotify-reauth.ics");
  fs.writeFileSync(icsPath, ics);
  console.log("\nToken expires around " + expiryLabel + ".");
  console.log("Opening a calendar reminder for 2 weeks before...");
  exec('open "' + icsPath + '"', function onOpen(openError) {
    if (openError) {
      console.log("(Could not open Calendar - import " + icsPath + " manually)");
    }
  });
}

const env = readEnvFile();
const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const VM_SSH_TARGET = env.VM_SSH_TARGET;
const VM_ENV_PATH = env.VM_ENV_PATH;
const VM_PM2_APP = env.VM_PM2_APP;

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
    if (!tokens.refresh_token) {
      throw new Error("Token response contained no refresh_token");
    }

    writeRefreshToken(tokens.refresh_token);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>Success</h1><p>Authorization complete. You can close this window.</p>",
    );

    console.log("\nNew refresh token written to .env.local");
    server.close();

    const deployed = deployToServer(tokens.refresh_token);
    if (deployed) {
      await verifyLive();
    } else {
      printManualSteps(tokens.refresh_token);
      process.exitCode = 1;
    }
    createReauthReminder();
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
