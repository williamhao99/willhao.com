"use client";

import styles from "./error.module.css";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Error</h1>
      <p className={styles.message}>Something went wrong</p>
      <button
        className={styles.button}
        onClick={retry}
      >
        <strong>↻ Try again</strong>
      </button>
    </div>
  );
}
