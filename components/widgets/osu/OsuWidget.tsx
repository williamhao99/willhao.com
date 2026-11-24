"use client";

import { useState, useEffect } from "react";
import type { OsuStats } from "@/lib/data/osu";
import ledger from "@/components/ledger/Ledger.module.css";

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

  useEffect(function setupPolling() {
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

  let rankDisplay = "—";
  if (typeof data.globalRank === "number") {
    rankDisplay = "#" + data.globalRank.toLocaleString("en-US");
  }

  let peakDisplay = "—";
  if (typeof data.peakRank === "number") {
    peakDisplay = "#" + data.peakRank.toLocaleString("en-US");
  }

  let ppDisplay = "—";
  if (typeof data.pp === "number") {
    ppDisplay = data.pp.toLocaleString("en-US");
  }

  let playTimeDisplay = "—";
  if (typeof data.playTime === "number") {
    playTimeDisplay = data.playTime.toLocaleString("en-US") + "h";
  }

  const ariaLabel =
    "osu! stats: rank " +
    rankDisplay +
    ", peak " +
    peakDisplay +
    ", pp " +
    ppDisplay +
    ", playtime " +
    playTimeDisplay;

  return (
    <li className={ledger.row}>
      <a
        href="https://osu.ppy.sh/users/whao"
        className={ledger.when + " " + ledger.rowLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel + " (opens in new tab)"}
      >
        osu!
      </a>
      <span
        className={ledger.stats}
        aria-hidden="true"
      >
        <span>
          {rankDisplay}
          <span className={ledger.unit}>rank</span>
        </span>
        <span>
          {peakDisplay}
          <span className={ledger.unit}>peak</span>
        </span>
        <span>
          {ppDisplay}
          <span className={ledger.unit}>pp</span>
        </span>
        <span>
          {playTimeDisplay}
          <span className={ledger.unit}>played</span>
        </span>
      </span>
    </li>
  );
}
