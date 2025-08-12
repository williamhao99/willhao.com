"use client";

import { useApiData } from "@/lib/hooks/useApiData";
import styles from "@/components/widgets/ClashWidget.module.css";
import { ClashIcon } from "@/components/icons/ClashIcon";

// Format trophy count for display
const formatTrophies = (trophies) => (trophies ? String(trophies) : "0");

export default function ClashWidget() {
  const { data, loading, error } = useApiData("/api/clash", {
    refetchInterval: 30000,
  });

  const hasError = error || !data?.townHallLevel;
  const isLoading = loading && !data;

  // Determine username based on state
  const username = isLoading
    ? "..."
    : hasError
      ? "API Error"
      : data?.name || "Player";

  // Render town hall level with appropriate styling
  const townHallLevel = (() => {
    if (isLoading) {
      return (
        <span className={`${styles.thLevel} ${styles.loadingDots}`}>TH?</span>
      );
    }

    if (hasError) {
      return (
        <span className={`${styles.thLevel} ${styles.errorText}`}>TH?</span>
      );
    }

    return (
      <span className={styles.thLevel}>TH{data?.townHallLevel || "?"}</span>
    );
  })();

  // Render trophy values with loading/error states
  const getTrophyValue = (type) => {
    const value = type === "current" ? data?.trophies : data?.bestTrophies;

    if (isLoading) {
      return <span className={styles.loadingDots}>...</span>;
    }

    if (hasError) {
      return <span className={styles.errorText}>—</span>;
    }

    return formatTrophies(value);
  };

  const widgetClass = [
    styles.clashWidget,
    loading && styles.loading,
    error && styles.error,
  ]
    .filter(Boolean)
    .join(" ");

  const trophyData = [
    { label: "CURRENT", type: "current", emoji: "🏆", ariaLabel: "trophy" },
    { label: "BEST", type: "best", emoji: "⭐", ariaLabel: "star" },
  ];

  return (
    <div className={widgetClass}>
      <div className={styles.clashLink}>
        <div className={styles.widgetRow}>
          <div className={styles.leftSection}>
            <div
              className={[styles.clashIcon, isLoading && styles.skeleton]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              <ClashIcon size={32} />
            </div>
            <div
              className={[styles.username, isLoading && styles.loadingText]
                .filter(Boolean)
                .join(" ")}
            >
              {username}
            </div>
          </div>
          <div className={styles.clashRow}>
            <div className={styles.townhall}>
              <span className={styles.thEmoji}>🏰</span>
              {townHallLevel}
            </div>
            <div className={styles.trophiesCol}>
              {trophyData.map(({ label, type, emoji, ariaLabel }) => (
                <div key={type} className={styles.trophyRow}>
                  <span className={styles.trophyLabel}>{label}</span>
                  <span className={styles.trophyValue}>
                    <span role="img" aria-label={ariaLabel}>
                      {emoji}
                    </span>
                    {getTrophyValue(type)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
