"use client";

import { useApiData } from "@/lib/hooks/useApiData";
import styles from "./ChessWidget.module.css";
import ChessIcon from "@/components/icons/ChessIcon";

// chess rating widget
export default function ChessWidget() {
  const { data, loading, error } = useApiData("/api/chess", {
    refetchInterval: 5 * 60 * 1000,
  });

  const uscfRating = 1815; // static USCF rating
  const formatRating = (rating) => (rating ? Math.round(rating) : "—");


  // render rating with loading/error states
  const renderRatingValue = (type) => {
    if (loading && !data)
      return (
        <span className={`${styles.ratingValue} ${styles.loadingDots}`}>
          ...
        </span>
      );
    // error or null ratings
    if (
      error ||
      (data &&
        !data.rapid?.rating &&
        !data.blitz?.rating &&
        !data.bullet?.rating)
    )
      return (
        <span className={`${styles.ratingValue} ${styles.errorText}`}>—</span>
      );
    if (type === "uscf")
      return <span className={styles.ratingValue}>{uscfRating}</span>;
    return (
      <span className={styles.ratingValue}>
        {formatRating(data?.[type]?.rating)}
      </span>
    );
  };

  return (
    <div
      className={`${styles.chessWidget} ${loading ? styles.loading : ""} ${error ? styles.error : ""}`}
    >
      <a
        href="https://chess.com/member/javablob"
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
              javablob
            </div>
          </div>
          <div className={styles.ratings}>
            <div className={styles.ratingRow}>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>Rapid</span>
                {renderRatingValue("rapid")}
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>Blitz</span>
                {renderRatingValue("blitz")}
              </div>
            </div>
            <div className={styles.ratingRow}>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>Bullet</span>
                {renderRatingValue("bullet")}
              </div>
              <div className={styles.ratingItem}>
                <span className={styles.ratingLabel}>USCF</span>
                {renderRatingValue("uscf")}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
