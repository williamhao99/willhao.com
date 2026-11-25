"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { projects } from "@/app/projects/projects";
import { blogPosts } from "@/app/blog/blogs";

// Fallback when sessionStorage is blocked
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
    // Private mode or storage full
  }
}

function wait(ms: number): Promise<void> {
  return new Promise(function resolveLater(resolve) {
    setTimeout(resolve, ms);
  });
}

function buildSlugMap(): Record<string, string> {
  const map: Record<string, string> = {
    "/": "home",
    "/projects": "projects",
    "/blog": "blog",
  };
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (!project) continue;
    if (project.link && project.link.startsWith("/projects/")) {
      map[project.link] = "projects-" + project.link.slice("/projects/".length);
    }
  }
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (!post) continue;
    map[post.link] = "blog-" + post.slug;
  }
  return map;
}

const VIEW_PAGES = buildSlugMap();

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
        // POST once per session, then only read
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
      // Retry
    }
  }

  return null;
}

export default function ViewCounter() {
  const pathname = usePathname();
  // null = every attempt failed
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({});
  const startedRef = useRef<Set<string>>(new Set());

  const slug = VIEW_PAGES[pathname] || null;

  useEffect(
    function fetchOrIncrementView() {
      if (!slug) return;
      if (startedRef.current.has(slug)) return;
      startedRef.current.add(slug);

      const currentSlug = slug;

      async function recordView() {
        const views = await loadViews(currentSlug);

        if (views === null) {
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

  if (!slug) {
    return null;
  }

  const views = viewsMap[slug];

  if (views === null || views === undefined) {
    return null;
  }

  let viewsText = views.toLocaleString("en-US") + " views";
  if (views === 1) {
    viewsText = "1 view";
  }

  return <span>{viewsText}</span>;
}
