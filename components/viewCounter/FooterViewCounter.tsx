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

const MAX_VIEW_RETRIES = 2;
const VIEW_RETRY_DELAY_MS = 1000;

export default function FooterViewCounter() {
  const pathname = usePathname();
  const [viewsMap, setViewsMap] = useState<Record<string, number>>({});
  const requestsRef = useRef<Map<string, Promise<number>>>(new Map());
  const postedSlugsRef = useRef<Set<string>>(new Set());

  const slug = FOOTER_VIEW_PAGES[pathname] || null;

  useEffect(
    function fetchOrIncrementView() {
      if (!slug) return;

      const currentSlug = slug;
      let cancelled = false;
      let retries = 0;
      let retryTimer: ReturnType<typeof setTimeout> | undefined;

      async function fetchViews(): Promise<number> {
        let response;
        if (
          hasViewedThisSession(currentSlug) ||
          postedSlugsRef.current.has(currentSlug)
        ) {
          response = await fetch("/api/views/" + currentSlug);
        } else {
          // A lost POST response may still have incremented the count.
          // Recovery requests only read, so they cannot count it twice.
          postedSlugsRef.current.add(currentSlug);
          response = await fetch("/api/views/" + currentSlug, {
            method: "POST",
          });
        }

        if (!response.ok) {
          throw new Error("View count request failed: " + response.status);
        }

        const data = await response.json();
        if (!Number.isSafeInteger(data.views) || data.views < 0) {
          throw new Error("Invalid view count response");
        }

        markAsViewed(currentSlug);
        return data.views;
      }

      async function recordView() {
        // Reuse each slug's request across navigation; failed ones are dropped so revisits retry
        let request = requestsRef.current.get(currentSlug);
        if (!request) {
          request = fetchViews();
          requestsRef.current.set(currentSlug, request);
        }

        try {
          const views = await request;
          if (cancelled) return;

          setViewsMap(function updateMap(prev) {
            const next: Record<string, number> = {};
            const keys = Object.keys(prev);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              if (!key) continue;
              next[key] = prev[key] || 0;
            }
            next[currentSlug] = views;
            return next;
          });
        } catch (error) {
          if (requestsRef.current.get(currentSlug) === request) {
            requestsRef.current.delete(currentSlug);
          }
          if (cancelled) return;

          if (retries < MAX_VIEW_RETRIES) {
            retryTimer = setTimeout(
              recordView,
              VIEW_RETRY_DELAY_MS * 2 ** retries,
            );
            retries += 1;
            return;
          }

          if (error instanceof Error) {
            console.error("Failed to fetch view count:", error.message);
          }
        }
      }

      recordView();

      return function stopRetries() {
        cancelled = true;
        clearTimeout(retryTimer);
      };
    },
    [slug],
  );

  // Don't render anything if not on a footer-view page
  if (!slug) {
    return null;
  }

  const views = viewsMap[slug];
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
