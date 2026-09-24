"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./FooterViewCounter.module.css";

// Fallback when sessionStorage is blocked, so a revisit still only reads
const viewedInMemory = new Set<string>();

function hasViewedThisSession(slug: string): boolean {
  if (viewedInMemory.has(slug)) return true;
  try {
    return sessionStorage.getItem("viewed-" + slug) !== null;
  } catch (e) {
    return false;
  }
}

function markAsViewed(slug: string): void {
  viewedInMemory.add(slug);
  try {
    sessionStorage.setItem("viewed-" + slug, "1");
  } catch (e) {
    // Ignore - private mode or storage full
  }
}

function wait(ms: number): Promise<void> {
  return new Promise(function resolveLater(resolve) {
    setTimeout(resolve, ms);
  });
}

// Pages that show views in footer
const FOOTER_VIEW_PAGES: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/works": "works",
  "/blog": "blog",
};

const MAX_VIEW_ATTEMPTS = 3;
const VIEW_RETRY_DELAY_MS = 1000;
const VIEW_TIMEOUT_MS = 5000;

async function loadViews(slug: string): Promise<number | null> {
  for (let attempt = 0; attempt < MAX_VIEW_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await wait(VIEW_RETRY_DELAY_MS * attempt);
    }

    try {
      const signal = AbortSignal.timeout(VIEW_TIMEOUT_MS);
      let response;
      if (hasViewedThisSession(slug)) {
        response = await fetch("/api/views/" + slug, { signal: signal });
      } else {
        // POST at most once per session: a lost response may still have
        // counted, so retries and reloads only read
        markAsViewed(slug);
        response = await fetch("/api/views/" + slug, {
          method: "POST",
          signal: signal,
        });
      }
      if (!response.ok) continue;

      const data = await response.json();
      if (Number.isSafeInteger(data.views) && data.views >= 0) {
        return data.views;
      }
    } catch (error) {
      // Network failure, timeout or malformed body - retry
    }
  }

  return null;
}

export default function FooterViewCounter() {
  const pathname = usePathname();
  // null = every attempt failed
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({});
  const startedRef = useRef<Set<string>>(new Set());

  const slug = FOOTER_VIEW_PAGES[pathname] || null;

  useEffect(
    function fetchOrIncrementView() {
      if (!slug) return;
      // The footer never unmounts, so one request per slug covers navigation
      if (startedRef.current.has(slug)) return;
      startedRef.current.add(slug);

      const currentSlug = slug;

      async function recordView() {
        const views = await loadViews(currentSlug);

        if (views === null) {
          // Let the next visit to this page try again
          startedRef.current.delete(currentSlug);
          console.error("Failed to fetch view count for " + currentSlug);
        }

        setViewsMap(function updateMap(prev) {
          const next: Record<string, number | null> = Object.assign({}, prev);
          next[currentSlug] = views;
          return next;
        });
      }

      recordView();
    },
    [slug],
  );

  // Don't render anything if not on a footer-view page
  if (!slug) {
    return null;
  }

  const views = viewsMap[slug];

  // Hidden after a failed round until a later visit succeeds, rather than a dash
  if (views === null) {
    return null;
  }

  let viewsText = "— views";
  if (views === 1) {
    viewsText = "1 view";
  } else if (views !== undefined) {
    viewsText = views.toLocaleString("en-US") + " views";
  }

  return (
    <span className={styles.viewCounter}>
      <span className={styles.separator}>•</span>
      <span className={styles.views}>{viewsText}</span>
    </span>
  );
}
