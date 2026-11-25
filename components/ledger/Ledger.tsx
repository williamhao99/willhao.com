import type { ReactNode } from "react";
import styles from "./Ledger.module.css";

interface LedgerProps {
  label?: string;
  children: ReactNode;
}

export default function Ledger({ label, children }: LedgerProps) {
  let heading = null;
  if (label) {
    heading = <h2 className={styles.label}>{label}</h2>;
  }

  return (
    <section className={styles.block}>
      {heading}
      {/* Safari drops list semantics when list-style is none */}
      <ul
        className={styles.ledger + " " + styles.loose}
        role="list"
      >
        {children}
      </ul>
    </section>
  );
}
