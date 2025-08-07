import { useState, useEffect } from "react";

// Fetch data with loading/error state
export function useApiData(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let interval;

    // Fetch once (and on interval if provided)
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        // Parse JSON safely
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          throw new Error("Invalid JSON response from server");
        }

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

    // Optional refetch interval
    if (options.refetchInterval) {
      interval = setInterval(fetchData, options.refetchInterval);
    }

    return () => {
      controller.abort();
      if (interval) clearInterval(interval);
    };
  }, [url, options.refetchInterval]);

  return { data, loading, error };
}
