"use client";

import { useState, useEffect } from "react";
import type { LiveData } from "@/lib/data/live";
import ChessWidget from "@/components/widgets/chess/ChessWidget";
import OsuWidget from "@/components/widgets/osu/OsuWidget";
import SpotifyWidget, {
  markBackoff,
  demoteStale,
} from "@/components/widgets/spotify/SpotifyWidget";

interface LiveRowsProps {
  initialData: LiveData;
}

// About 5 min of failed polls
const STALE_POLL_LIMIT = 150;
const POLL_TIMEOUT_MS = 8000;

export default function LiveRows({ initialData }: LiveRowsProps) {
  const [data, setData] = useState<LiveData>(initialData);

  useEffect(function setupPolling() {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;
    let failedSpotifyPolls = 0;
    let pending = false;

    // next = null when the whole request failed
    function applyPoll(next: LiveData | null) {
      if (next && next.spotify) {
        failedSpotifyPolls = 0;
      } else {
        failedSpotifyPolls = failedSpotifyPolls + 1;
      }
      const stale = failedSpotifyPolls >= STALE_POLL_LIMIT;
      // One missed poll is not shown
      const retrying = failedSpotifyPolls > 1;

      setData(function merge(prev) {
        const merged: LiveData = {
          spotify: prev.spotify,
          chess: prev.chess,
          osu: prev.osu,
        };
        if (next && next.chess) {
          merged.chess = next.chess;
        }
        if (next && next.osu) {
          merged.osu = next.osu;
        }
        if (next && next.spotify) {
          merged.spotify = next.spotify;
        } else if (stale) {
          merged.spotify = demoteStale(prev.spotify);
        } else if (retrying) {
          merged.spotify = markBackoff(prev.spotify);
        }
        return merged;
      });
    }

    async function fetchData() {
      if (pending) return;
      pending = true;
      try {
        const response = await fetch("/api/live", {
          signal: AbortSignal.timeout(POLL_TIMEOUT_MS),
        });
        if (!isMounted) return;
        if (response.ok) {
          applyPoll(await response.json());
        } else {
          applyPoll(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch live data:", error);
          applyPoll(null);
        }
      } finally {
        pending = false;
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

  return (
    <>
      <ChessWidget data={data.chess} />
      <OsuWidget data={data.osu} />
      <SpotifyWidget data={data.spotify} />
    </>
  );
}
