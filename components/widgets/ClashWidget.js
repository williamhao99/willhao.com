import { useApiData } from "@/lib/hooks/useApiData";

// clash of clans stats widget
export default function ClashWidget() {
  const { data, loading, error } = useApiData("/api/clash", {
    refetchInterval: 30 * 1000,
  });

  // format trophy count
  const formatTrophies = (trophies) => (trophies ? String(trophies) : "0");

  // clash icon image
  const icon = (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href="/images/clash-of-clans-icon.png"
        x="0"
        y="0"
        width="32"
        height="32"
        style={{ borderRadius: "4px", objectFit: "cover" }}
      />
    </svg>
  );

  // get username with error handling
  const getUsername = () => {
    if (loading && !data) return "...";
    // error or no data
    if (error || !data?.townHallLevel) return "API Error";
    return data?.name || "Player";
  };

  // get town hall level display
  const getTownHallLevel = () => {
    if (loading && !data)
      return <span className="th-level loading-dots">TH?</span>;
    if (error || !data?.townHallLevel)
      return <span className="th-level error-text">TH?</span>;
    return <span className="th-level">TH{data?.townHallLevel || "?"}</span>;
  };

  // get trophy value for current/best
  const getTrophyValue = (type) => {
    const value = type === "current" ? data?.trophies : data?.bestTrophies;
    if (loading && !data) return <span className="loading-dots">...</span>;
    if (error || !data?.townHallLevel)
      return <span className="error-text">—</span>;
    return formatTrophies(value);
  };

  return (
    <div
      className={`clash-widget ${loading ? "loading" : ""} ${error ? "error" : ""}`}
    >
      <div className="clash-link">
        <div className="widget-row">
          <div className="clash-left-section">
            <div
              className={`clash-icon ${loading && !data ? "skeleton" : ""}`}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div
              className={`widget-username ${loading && !data ? "loading-text" : ""}`}
            >
              {getUsername()}
            </div>
          </div>
          <div className="clash-row">
            <div className="clash-townhall">
              <span className="th-emoji">🏰</span>
              {getTownHallLevel()}
            </div>
            <div className="clash-trophies-col">
              <div className="trophy-row">
                <span className="trophy-label">CURRENT</span>
                <span className="trophy-value">
                  <span role="img" aria-label="trophy">
                    🏆
                  </span>
                  {getTrophyValue("current")}
                </span>
              </div>
              <div className="trophy-row">
                <span className="trophy-label">BEST</span>
                <span className="trophy-value">
                  <span role="img" aria-label="star">
                    ⭐
                  </span>
                  {getTrophyValue("best")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
