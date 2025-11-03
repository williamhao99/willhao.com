"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshWidget({ seconds }: { seconds: number }) {
  const router = useRouter();

  useEffect(
    function handleAutoRefresh() {
      if (seconds <= 0) return;

      let interval: NodeJS.Timeout | null = null;

      function startInterval() {
        if (interval) return;
        interval = setInterval(function refreshPage() {
          router.refresh();
        }, seconds * 1000);
      }

      function stopInterval() {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }

      function handleVisibilityChange() {
        if (document.visibilityState === "visible") {
          router.refresh();
          startInterval();
        } else {
          stopInterval();
        }
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);
      startInterval();

      return function cleanup() {
        stopInterval();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    },
    [seconds, router],
  );

  return null;
}
