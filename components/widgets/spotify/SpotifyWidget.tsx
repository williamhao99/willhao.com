"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import type { SpotifyData } from "@/lib/data/spotify";
import styles from "./SpotifyWidget.module.css";

interface SpotifyWidgetProps {
  initialData: SpotifyData | null;
}

interface MarqueeTextProps {
  text: string;
  className: string | undefined;
  resetKey: string;
}

const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "—",
  artist: "—",
};

// Keep the shown data on a failed poll, but surface the retry state
function markBackoff(prev: SpotifyData): SpotifyData {
  if (prev.backoff) {
    return prev;
  }
  const next: SpotifyData = {
    isPlaying: prev.isPlaying,
    songTitle: prev.songTitle,
    artist: prev.artist,
    backoff: true,
  };
  if (prev.lastPlayed) {
    next.lastPlayed = prev.lastPlayed;
  }
  return next;
}

// After ~5min of failed polls, stop asserting live playback the server
// would no longer vouch for
const STALE_POLL_LIMIT = 150;

function demoteStale(prev: SpotifyData): SpotifyData {
  if (!prev.isPlaying && prev.lastPlayed !== "(paused)") {
    return markBackoff(prev);
  }
  return {
    isPlaying: false,
    songTitle: prev.songTitle,
    artist: prev.artist,
    backoff: true,
  };
}

export default function SpotifyWidget({ initialData }: SpotifyWidgetProps) {
  const [data, setData] = useState<SpotifyData>(initialData || DEFAULT_DATA);

  useEffect(function setupPolling() {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;
    let failedPolls = 0;

    async function fetchData() {
      try {
        const response = await fetch("/api/spotify");
        if (!isMounted) return;
        if (response.ok) {
          const newData: SpotifyData = await response.json();
          failedPolls = 0;
          setData(newData);
        } else {
          failedPolls = failedPolls + 1;
          if (failedPolls >= STALE_POLL_LIMIT) {
            setData(demoteStale);
          } else {
            setData(markBackoff);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch Spotify data:", error);
          failedPolls = failedPolls + 1;
          if (failedPolls >= STALE_POLL_LIMIT) {
            setData(demoteStale);
          } else {
            setData(markBackoff);
          }
        }
      }
    }

    function startPolling() {
      if (intervalId) return;
      // Fetch immediately so tab returns catch up
      fetchData();
      intervalId = setInterval(fetchData, 2000);
    }

    function stopPolling() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    }

    // Start polling if page is visible
    if (document.visibilityState === "visible") {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return function cleanup() {
      isMounted = false;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  let isPlaying = data.isPlaying;
  let songTitle = data.songTitle;
  let artist = data.artist;
  let lastPlayed = data.lastPlayed;

  let statusText = "Last played";
  if (isPlaying) {
    statusText = "Now playing";
  } else if (lastPlayed) {
    statusText = "Last played " + lastPlayed;
  }
  if (data.backoff) {
    statusText = statusText + " (retrying)";
  }

  let widgetClassName = styles.widget;
  if (isPlaying) {
    widgetClassName = styles.widget + " " + styles.playing;
  }

  const songKey = songTitle + "_" + artist;

  return (
    <a
      href="https://open.spotify.com/user/williamhao99?si=68fe50e5f8814bf6"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={"Spotify: " + songTitle + " by " + artist}
    >
      <div className={widgetClassName}>
        <div className={styles.icon}>
          <SpotifyIcon />
        </div>
        <div className={styles.content}>
          <span className={styles.status}>{statusText}</span>
          <MarqueeText
            text={songTitle}
            className={styles.title}
            resetKey={songKey}
          />
          <MarqueeText
            text={artist}
            className={styles.artist}
            resetKey={songKey}
          />
        </div>
      </div>
    </a>
  );
}

function MarqueeText({ text, className, resetKey }: MarqueeTextProps) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(
    function measureOverflow() {
      function measure() {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) return;
        let diff = inner.offsetWidth - outer.clientWidth;
        if (diff < 0) {
          diff = 0;
        }
        setOverflow(diff);
      }

      measure();

      // Re-measure after fonts finish loading — Newsreader may shift widths
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function onFontsReady() {
          measure();
        });
      }

      window.addEventListener("resize", measure);
      return function cleanup() {
        window.removeEventListener("resize", measure);
      };
    },
    [text],
  );

  let innerClassName = styles.scrollInner;
  let innerStyle: CSSProperties = {};
  if (overflow > 0) {
    innerClassName = styles.scrollInner + " " + styles.marquee;
    innerStyle = { "--overflow-distance": overflow + "px" } as CSSProperties;
  }

  return (
    <span
      ref={outerRef}
      className={className}
    >
      <span
        key={resetKey}
        ref={innerRef}
        className={innerClassName}
        style={innerStyle}
      >
        {text}
      </span>
    </span>
  );
}
