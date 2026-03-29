"use client";

import { useState, useEffect } from "react";
import OsuIcon from "@/components/icons/OsuIcon";
import type { OsuStats } from "@/lib/data/osu";
import styles from "./OsuWidget.module.css";

interface OsuWidgetProps {
  initialData: OsuStats | null;
}

const DEFAULT_DATA: OsuStats = {
  globalRank: null,
  peakRank: null,
  pp: null,
  playTime: null,
};

export default function OsuWidget({ initialData }: OsuWidgetProps) {
  const [data, setData] = useState<OsuStats>(initialData || DEFAULT_DATA);

  useEffect(
    function setupPolling() {
      let isMounted = true;
      let intervalId: NodeJS.Timeout | null = null;

      async function fetchData() {
        try {
          const response = await fetch("/api/osu");
          if (response.ok && isMounted) {
            const newData: OsuStats = await response.json();
            setData(newData);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Failed to fetch osu! data:", error);
          }
        }
      }

      function startPolling() {
        if (intervalId) return;
        // Only fetch immediately if we don't have valid initial data
        if (!initialData) {
          fetchData();
        }
        intervalId = setInterval(fetchData, 30000);
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

  let rankDisplay = "—";
  if (data.globalRank !== null) {
    rankDisplay = "#" + data.globalRank.toLocaleString();
  }

  let peakDisplay = "—";
  if (data.peakRank !== null) {
    peakDisplay = "#" + data.peakRank.toLocaleString();
  }

  let ppDisplay = "—";
  if (data.pp !== null) {
    ppDisplay = data.pp.toLocaleString();
  }

  let playTimeDisplay = "—";
  if (data.playTime !== null) {
    playTimeDisplay = data.playTime.toLocaleString() + "h";
  }

  return (
    <a
      href="https://osu.ppy.sh/users/whao"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="osu! profile and statistics"
    >
      <div className={styles.widget}>
        <div className={styles.icon}>
          <OsuIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <span className={styles.label}>RANK</span>
            <span className={styles.value}>{rankDisplay}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>PEAK</span>
            <span className={styles.value}>{peakDisplay}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>PP</span>
            <span className={styles.value}>{ppDisplay}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>PLAYTIME</span>
            <span className={styles.value}>{playTimeDisplay}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
