import { useApiData } from "@/lib/hooks/useApiData";
import styles from "./ClashWidget.module.css";

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
      return (
        <span className={`${styles.thLevel} ${styles.loadingDots}`}>TH?</span>
      );
    if (error || !data?.townHallLevel)
      return (
        <span className={`${styles.thLevel} ${styles.errorText}`}>TH?</span>
      );
    return (
      <span className={styles.thLevel}>TH{data?.townHallLevel || "?"}</span>
    );
  };

  // get trophy value for current/best
  const getTrophyValue = (type) => {
    const value = type === "current" ? data?.trophies : data?.bestTrophies;
    if (loading && !data)
      return <span className={styles.loadingDots}>...</span>;
    if (error || !data?.townHallLevel)
      return <span className={styles.errorText}>—</span>;
    return formatTrophies(value);
  };

  return (
    <div
      className={`${styles.clashWidget} ${loading ? styles.loading : ""} ${error ? styles.error : ""}`}
    >
      <div className={styles.clashLink}>
        <div className={styles.widgetRow}>
          <div className={styles.leftSection}>
            <div
              className={`${styles.clashIcon} ${loading && !data ? styles.skeleton : ""}`}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div
              className={`${styles.username} ${loading && !data ? styles.loadingText : ""}`}
            >
              {getUsername()}
            </div>
          </div>
          <div className={styles.clashRow}>
            <div className={styles.townhall}>
              <span className={styles.thEmoji}>🏰</span>
              {getTownHallLevel()}
            </div>
            <div className={styles.trophiesCol}>
              <div className={styles.trophyRow}>
                <span className={styles.trophyLabel}>CURRENT</span>
                <span className={styles.trophyValue}>
                  <span role="img" aria-label="trophy">
                    🏆
                  </span>
                  {getTrophyValue("current")}
                </span>
              </div>
              <div className={styles.trophyRow}>
                <span className={styles.trophyLabel}>BEST</span>
                <span className={styles.trophyValue}>
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
