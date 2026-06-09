import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import type { Database } from "firebase-admin/database";

let database: Database | null = null;
let warnedMissingConfig = false;

// Lazy init: getDatabase() throws when no app is configured, so resolve the
// database on first use and return null when credentials are absent
export function getDb(): Database | null {
  if (database) {
    return database;
  }

  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    if (!projectId || !clientEmail || !privateKey || !databaseURL) {
      if (!warnedMissingConfig) {
        warnedMissingConfig = true;
        console.warn("Firebase env vars missing - view counts disabled");
      }
      return null;
    }

    initializeApp({
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      databaseURL: databaseURL,
    });
  }

  database = getDatabase();
  return database;
}
