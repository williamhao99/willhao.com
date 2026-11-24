import Link from "next/link";
import styles from "./BackLink.module.css";

interface BackLinkProps {
  href: string;
  label: string;
}

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={styles.back}
      aria-label={label}
    >
      <span aria-hidden="true">←</span>
    </Link>
  );
}
