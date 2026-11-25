"use client";

import { usePathname } from "next/navigation";
import BackLink from "@/components/backLink/BackLink";
import styles from "./status.module.css";

export default function Error({ retry }: { retry: () => void }) {
  const pathname = usePathname();

  let back = null;
  if (pathname !== "/") {
    back = (
      <BackLink
        href="/"
        label="Back to home"
      />
    );
  }

  return (
    <>
      {back}
      <h1>Something went wrong</h1>
      <button
        className={styles.action}
        onClick={retry}
      >
        Try again
      </button>
    </>
  );
}
