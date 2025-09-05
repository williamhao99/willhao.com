"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefreshWidget({ seconds }: { seconds: number }) {
  const router = useRouter();

  useEffect(() => {
    function refreshPage() {
      router.refresh();
    }

    const interval = setInterval(refreshPage, seconds * 1000);

    function cleanup() {
      clearInterval(interval);
    }

    return cleanup;
  }, [seconds, router]);

  return null;
}
