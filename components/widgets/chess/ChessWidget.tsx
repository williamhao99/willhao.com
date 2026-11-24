"use client";

import { useState, useEffect } from "react";
import type { ChessStats } from "@/lib/data/chess";
import ledger from "@/components/ledger/Ledger.module.css";

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

  useEffect(function setupPolling() {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchData() {
      try {
        const response = await fetch("/api/chess");
        if (response.ok && isMounted) {
          const newData: ChessStats = await response.json();
          setData(newData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch Chess data:", error);
        }
      }
    }

    function startPolling() {
      if (intervalId) return;
      fetchData();
      intervalId = setInterval(fetchData, 60000);
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

  let rapidRating: string | number = "—";
  if (typeof data.rapid === "number") {
    rapidRating = data.rapid;
  }

  let blitzRating: string | number = "—";
  if (typeof data.blitz === "number") {
    blitzRating = data.blitz;
  }

  let bulletRating: string | number = "—";
  if (typeof data.bullet === "number") {
    bulletRating = data.bullet;
  }

  // No USCF API - update by hand
  const uscfRating = 1815;

  const ariaLabel =
    "Chess.com ratings: rapid " +
    rapidRating +
    ", blitz " +
    blitzRating +
    ", bullet " +
    bulletRating +
    ", USCF " +
    uscfRating;

  return (
    <li className={ledger.row}>
      <a
        href="https://www.chess.com/member/javablob"
        className={ledger.when + " " + ledger.rowLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel + " (opens in new tab)"}
      >
        Chess
      </a>
      <span
        className={ledger.stats}
        aria-hidden="true"
      >
        <span>
          {rapidRating}
          <span className={ledger.unit}>rapid</span>
        </span>
        <span>
          {blitzRating}
          <span className={ledger.unit}>blitz</span>
        </span>
        <span>
          {bulletRating}
          <span className={ledger.unit}>bullet</span>
        </span>
        <span>
          {uscfRating}
          <span className={ledger.unit}>USCF</span>
        </span>
      </span>
    </li>
  );
}
