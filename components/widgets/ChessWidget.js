"use client";

import { useApiData } from "@/lib/hooks/useApiData";
import { CHESS_USERNAME } from "@/lib/config";
import styles from "./ChessWidget.module.css";
import ChessIcon from "@/components/icons/ChessIcon";

// Constants
const USCF_RATING = 1815;
const RATING_PLACEHOLDER = "—";
const RATING_TYPES = [
  ["rapid", "blitz"],
  ["bullet", "uscf"],
];

// Format chess rating for display
const formatRating = (rating) =>
  rating ? Math.round(rating) : RATING_PLACEHOLDER;

export default function ChessWidget() {
  const { data, loading, error } = useApiData("/api/chess", {
    refetchInterval: 300000, // 5 minutes
  });

  const hasNoRatings =
    data && !data.rapid?.rating && !data.blitz?.rating && !data.bullet?.rating;

  // Render rating values with loading/error states
  const renderRatingValue = (type) => {
    if (loading && !data) {
      return (
        <span className={`${styles.ratingValue} ${styles.loadingDots}`}>
          ...
        </span>
      );
    }

    if (error || hasNoRatings) {
      return (
        <span className={`${styles.ratingValue} ${styles.errorText}`}>
          {RATING_PLACEHOLDER}
        </span>
      );
    }

    if (type === "uscf") {
      return <span className={styles.ratingValue}>{USCF_RATING}</span>;
    }

    return (
      <span className={styles.ratingValue}>
        {formatRating(data?.[type]?.rating)}
      </span>
    );
  };

  const widgetClass = [
    styles.chessWidget,
    loading && styles.loading,
    error && styles.error,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={widgetClass}>
      <a
        href={`https://chess.com/member/${CHESS_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.chessLink}
        aria-label="View chess profile"
      >
        <div className={styles.widgetRow}>
          <div className={styles.leftSection}>
            <div
              className={`${styles.icon} ${loading && !data ? styles.skeleton : ""}`}
              aria-hidden="true"
            >
              <ChessIcon size={24} />
            </div>
            <div
              className={`${styles.username} ${loading && !data ? styles.loadingText : ""}`}
            >
              {CHESS_USERNAME}
            </div>
          </div>
          <div className={styles.ratings}>
            {RATING_TYPES.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.ratingRow}>
                {row.map((type) => (
                  <div key={type} className={styles.ratingItem}>
                    <span className={styles.ratingLabel}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    {renderRatingValue(type)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}
