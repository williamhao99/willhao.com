import Link from "next/link";
import GitHubIcon from "@/components/icons/GitHubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import GmailIcon from "@/components/icons/GmailIcon";
import styles from "./Footer.module.css";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
];

const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/william-a-hao/",
    Icon: LinkedInIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/williamhao99",
    Icon: GitHubIcon,
  },
  {
    name: "Gmail",
    href: "mailto:william.hao.55@gmail.com",
    Icon: GmailIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/william.a.hao/",
    Icon: InstagramIcon,
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/user/williamhao99?si=68fe50e5f8814bf6",
    Icon: SpotifyIcon,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <nav className={styles.nav} aria-label="Footer navigation">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          <p className={styles.copyright}>© {currentYear} William Hao</p>

          <div className={styles.social} aria-label="Social links">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={name}
              >
                <Icon className={styles.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
