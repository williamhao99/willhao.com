import ViewCounter from "@/components/viewCounter/ViewCounter";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="mailto:william.hao.55@gmail.com"
        className={styles.email}
      >
        william.hao.55@gmail.com
      </a>
      <div className={styles.row}>
        <div className={styles.links}>
          <a
            href="https://github.com/williamhao99"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>
          <a
            href="https://www.linkedin.com/in/william-a-hao/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <span className="visually-hidden"> (opens in new tab)</span>
          </a>
        </div>
        <ViewCounter />
      </div>
    </footer>
  );
}
