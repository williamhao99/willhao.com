import { useState, useEffect } from "react";

// custom hook for API data fetching
export function useApiData(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // async data fetcher
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // setup refetch interval if provided
    if (options.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [url, options.refetchInterval]);

  return { data, loading, error };
}
