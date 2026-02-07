"use client";

import styles from "./error.module.css";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Error</h1>
      <p className={styles.message}>Something went wrong</p>
      <button
        className={styles.button}
        onClick={reset}
      >
        <strong>↻ Try again</strong>
      </button>
    </div>
  );
}
