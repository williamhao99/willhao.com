"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ViewCounter.module.css";

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

interface ViewCounterProps {
  slug: string;
  initialViews?: number;
}

export default function ViewCounter({ slug, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(initialViews ?? null);
  const hasFetchedRef = useRef(false);

  useEffect(
    function fetchOrIncrementView() {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      const alreadyViewed = hasViewedThisSession(slug);

      async function recordView() {
        try {
          let response;
          if (alreadyViewed) {
            response = await fetch("/api/views/" + slug);
          } else {
            response = await fetch("/api/views/" + slug, { method: "POST" });
            markAsViewed(slug);
          }
          if (response.ok) {
            const data = await response.json();
            setViews(data.views);
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("Failed to fetch view count:", error.message);
          }
        }
      }

      recordView();
    },
    [slug],
  );

  if (views === null) {
    return <span className={styles.views}>— views</span>;
  }

  return <span className={styles.views}>{views + " views"}</span>;
}
