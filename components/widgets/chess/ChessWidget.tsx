"use client";

import { useState, useEffect } from "react";
import ChessIcon from "@/components/icons/ChessIcon";
import type { ChessStats } from "@/lib/data/chess";
import styles from "./ChessWidget.module.css";

interface ChessWidgetProps {
  initialData: ChessStats | null;
}

const DEFAULT_DATA: ChessStats = {
  rapid: null,
  blitz: null,
  bullet: null,
};

export default function ChessWidget({ initialData }: ChessWidgetProps) {
  const [data, setData] = useState<ChessStats>(initialData || DEFAULT_DATA);

  useEffect(
    function setupPolling() {
      let intervalId: NodeJS.Timeout | null = null;

      async function fetchData() {
        try {
          const response = await fetch("/api/chess");
          if (response.ok) {
            const newData: ChessStats = await response.json();
            setData(newData);
          }
        } catch (error) {
          console.error("Failed to fetch Chess data:", error);
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
        stopPolling();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    },
    [initialData],
  );

  const rapidRating = data.rapid || "—";
  const blitzRating = data.blitz || "—";
  const bulletRating = data.bullet || "—";
  const uscfRating = 1815;

  return (
    <a
      href="https://www.chess.com/member/javablob"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.widget}>
        <div className={styles.icon}>
          <ChessIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <span className={styles.label}>RAPID</span>
            <span className={styles.value}>{rapidRating}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>BLITZ</span>
            <span className={styles.value}>{blitzRating}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>BULLET</span>
            <span className={styles.value}>{bulletRating}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>USCF</span>
            <span className={styles.value}>{uscfRating}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
