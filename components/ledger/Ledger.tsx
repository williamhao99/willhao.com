import type { ReactNode } from "react";
import styles from "./Ledger.module.css";

interface LedgerProps {
  label?: string;
  loose?: boolean;
  children: ReactNode;
}

export default function Ledger({ label, loose, children }: LedgerProps) {
  let listClassName = styles.ledger;
  if (loose) {
    listClassName = styles.ledger + " " + styles.loose;
  }

  let heading = null;
  if (label) {
    heading = <h2 className={styles.label}>{label}</h2>;
  }

  return (
    <section className={styles.block}>
      {heading}
      {/* Safari drops list semantics when list-style is none */}
      <ul
        className={listClassName}
        role="list"
      >
        {children}
      </ul>
    </section>
  );
}
