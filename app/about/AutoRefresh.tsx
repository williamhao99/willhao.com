"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshWidget({ seconds }: { seconds: number }) {
  const router = useRouter();

  useEffect(
    function handleAutoRefresh() {
      if (seconds <= 0) return;

      function refreshPage() {
        router.refresh();
      }

      const interval = setInterval(refreshPage, seconds * 1000);

      return function cleanup() {
        clearInterval(interval);
      };
    },
    [seconds, router],
  );

  return null;
}
