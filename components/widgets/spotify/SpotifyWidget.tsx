"use client";

import { useState, useEffect } from "react";
import type { SpotifyData } from "@/lib/data/spotify";
import ledger from "@/components/ledger/Ledger.module.css";
import styles from "./SpotifyWidget.module.css";

interface SpotifyWidgetProps {
  initialData: SpotifyData | null;
}

const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "—",
  artist: "—",
};

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
  if (prev.songUrl) {
    next.songUrl = prev.songUrl;
  }
  if (prev.lastPlayed) {
    next.lastPlayed = prev.lastPlayed;
  }
  return next;
}

// About 5 min of failed polls
const STALE_POLL_LIMIT = 150;

function demoteStale(prev: SpotifyData): SpotifyData {
  if (!prev.isPlaying && prev.lastPlayed !== "(paused)") {
    return markBackoff(prev);
  }
  const next: SpotifyData = {
    isPlaying: false,
    songTitle: prev.songTitle,
    artist: prev.artist,
    backoff: true,
  };
  if (prev.songUrl) {
    next.songUrl = prev.songUrl;
  }
  return next;
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

  const isPlaying = data.isPlaying;
  const songTitle = data.songTitle;
  const artist = data.artist;
  const lastPlayed = data.lastPlayed;

  let statusText = "played recently";
  if (isPlaying) {
    statusText = "playing now";
  } else if (lastPlayed === "(paused)") {
    statusText = "paused";
  } else if (lastPlayed) {
    statusText = "played " + lastPlayed;
  }
  if (data.backoff) {
    statusText = statusText + " (retrying)";
  }

  const linked = Boolean(data.songUrl);

  let by = null;
  let tip;
  let spoken = songTitle;
  if (artist !== "—") {
    tip = songTitle + " by " + artist;
    spoken = tip + ", " + statusText;
    let statusClass = styles.status;
    if (isPlaying && !data.backoff) {
      statusClass = styles.status + " " + styles.playing;
    }
    by = (
      <span
        className={styles.by}
        aria-hidden={linked}
      >
        <span className={styles.artist}>{artist}</span>
        <span className={statusClass}>{statusText}</span>
      </span>
    );
  }

  // The link speaks the whole row, so the second line is hidden from it
  let title = <span className={styles.title}>{songTitle}</span>;
  if (data.songUrl) {
    title = (
      <a
        href={data.songUrl}
        className={styles.title + " " + styles.song}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={spoken + " (opens in new tab)"}
      >
        {songTitle}
      </a>
    );
  }

  return (
    <li className={ledger.row}>
      <a
        href="https://open.spotify.com/user/williamhao99"
        className={ledger.when}
        target="_blank"
        rel="noopener noreferrer"
      >
        Spotify
        <span className="visually-hidden"> (opens in new tab)</span>
      </a>
      <span
        className={styles.track}
        title={tip}
      >
        {title}
        {by}
      </span>
    </li>
  );
}
