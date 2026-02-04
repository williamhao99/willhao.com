"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./FooterViewCounter.module.css";

function hasViewedThisSession(slug: string): boolean {
  try {
    return sessionStorage.getItem("viewed-" + slug) !== null;
  } catch (e) {
    return false;
  }
}

function markAsViewed(slug: string): void {
  try {
    sessionStorage.setItem("viewed-" + slug, "1");
  } catch (e) {
    // Ignore - private mode or storage full
  }
}

// Pages that show views in footer
const FOOTER_VIEW_PAGES: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/works": "works",
  "/blog": "blog",
};

export default function FooterViewCounter() {
  const pathname = usePathname();
  const [viewsMap, setViewsMap] = useState<Record<string, number>>({});
  const fetchedPathsRef = useRef<Set<string>>(new Set());

  const slug = FOOTER_VIEW_PAGES[pathname] || null;

  useEffect(
    function fetchOrIncrementView() {
      if (!slug) return;
      if (fetchedPathsRef.current.has(pathname)) return;
      fetchedPathsRef.current.add(pathname);

      const currentSlug = slug;
      const alreadyViewed = hasViewedThisSession(currentSlug);

      async function recordView() {
        try {
          let response;
          if (alreadyViewed) {
            response = await fetch("/api/views/" + currentSlug);
          } else {
            response = await fetch("/api/views/" + currentSlug, {
              method: "POST",
            });
            markAsViewed(currentSlug);
          }
          if (response.ok) {
            const data = await response.json();
            setViewsMap(function updateMap(prev) {
              const next: Record<string, number> = {};
              const keys = Object.keys(prev);
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (!key) continue;
                next[key] = prev[key] || 0;
              }
              next[currentSlug] = data.views;
              return next;
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("Failed to fetch view count:", error.message);
          }
        }
      }

      recordView();
    },
    [slug, pathname],
  );

  // Don't render anything if not on a footer-view page
  if (!slug) {
    return null;
  }

  const views = viewsMap[slug];

  if (views === undefined) {
    return null;
  }

  return (
    <span className={styles.viewCounter}>
      <span className={styles.separator}>•</span>
      <span className={styles.views}>{views + " views"}</span>
    </span>
  );
}
