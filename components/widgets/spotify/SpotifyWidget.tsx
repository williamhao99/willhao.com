"use client";

import { useState, useEffect } from "react";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import type { SpotifyData } from "@/lib/data/spotify";
import styles from "./SpotifyWidget.module.css";

interface SpotifyWidgetProps {
  initialData: SpotifyData | null;
}

const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "—",
  artist: "—",
};

export default function SpotifyWidget({ initialData }: SpotifyWidgetProps) {
  const [data, setData] = useState<SpotifyData>(initialData || DEFAULT_DATA);

  useEffect(
    function setupPolling() {
      let isMounted = true;
      let intervalId: NodeJS.Timeout | null = null;

      async function fetchData() {
        try {
          const response = await fetch("/api/spotify");
          if (response.ok && isMounted) {
            const newData: SpotifyData = await response.json();
            setData(newData);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Failed to fetch Spotify data:", error);
          }
        }
      }

      function startPolling() {
        if (intervalId) return;
        // Only fetch immediately if we don't have valid initial data
        if (!initialData) {
          fetchData();
        }
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
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    },
    [initialData],
  );

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

  let widgetClassName = styles.widget;
  if (isPlaying) {
    widgetClassName = styles.widget + " " + styles.playing;
  }

  return (
    <a
      href="https://open.spotify.com/user/williamhao99?si=68fe50e5f8814bf6"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={widgetClassName}>
        <div className={styles.icon}>
          <SpotifyIcon />
        </div>
        <div className={styles.content}>
          <span className={styles.status}>{statusText}</span>
          <span className={styles.title}>{songTitle}</span>
          <span className={styles.artist}>{artist}</span>
        </div>
      </div>
    </a>
  );
}
