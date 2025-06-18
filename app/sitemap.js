// app/sitemap.js
import fs from "fs/promises";
import path from "path";

const BASE = "https://willhao.com";
const APP_DIR = path.join(process.cwd(), "app");

async function getRoutes(dir = APP_DIR) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== "api" && !e.name.startsWith("_"))
        return getRoutes(full);
      if (e.name === "page.js") {
        const rel = path.relative(APP_DIR, dir).replace(/\\/g, "/");
        return rel ? `/${rel}` : "/";
      }
    }),
  );
  return nested.flat().filter(Boolean);
}

export default async function sitemap() {
  const routes = await getRoutes();

  return Promise.all(
    routes.map(async (r) => {
      const pagePath = path.join(
        APP_DIR,
        r === "/" ? "page.js" : `${r}/page.js`,
      );
      const { mtime } = await fs.stat(pagePath);

      return {
        url: `${BASE}${r}`,
        lastModified: mtime.toISOString(),
        changeFrequency:
          r === "/" || r.startsWith("/blog") ? "weekly" : "monthly",
        priority: r === "/" ? 1.0 : r.split("/").length === 2 ? 0.8 : 0.7,
      };
    }),
  );
}
