import ViewCounter from "@/components/viewCounter/ViewCounter";
import styles from "./Footer.module.css";

const LINKS = [
  { label: "GitHub", href: "https://github.com/williamhao99" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/william-a-hao/" },
];

export default function Footer() {
  function renderLinks() {
    const links = [];
    for (let i = 0; i < LINKS.length; i++) {
      const link = LINKS[i];
      if (!link) continue;

      links.push(
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
          <span className="visually-hidden"> (opens in new tab)</span>
        </a>,
      );
    }
    return links;
  }

  return (
    <footer className={styles.footer}>
      <a
        href="mailto:william.hao.55@gmail.com"
        className={styles.email}
      >
        william.hao.55@gmail.com
      </a>
      <div className={styles.row}>
        <div className={styles.links}>{renderLinks()}</div>
        <ViewCounter />
      </div>
    </footer>
  );
}
