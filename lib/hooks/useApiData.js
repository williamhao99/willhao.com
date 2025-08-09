import { useState, useEffect } from "react";

// Custom hook for fetching and managing API data with optional polling
export function useApiData(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let interval;

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse JSON with fallback error handling
        const result = await response.json().catch(() => {
          throw new Error("Invalid JSON response from server");
        });

        if (!controller.signal.aborted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Set up polling if interval is specified
    if (options.refetchInterval) {
      interval = setInterval(fetchData, options.refetchInterval);
    }

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [url, options.refetchInterval]);

  return { data, loading, error };
}
