import type { Metadata } from "next";
import BackLink from "@/components/backLink/BackLink";
import styles from "./status.module.css";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <>
      <BackLink
        href="/"
        label="Back to home"
      />
      <h1>Page not found</h1>
      <p className={styles.message}>There is nothing at this address.</p>
    </>
  );
}
