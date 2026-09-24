import Link from "next/link";
import GitHubIcon from "@/components/icons/GitHubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import SpotifyIcon from "@/components/icons/SpotifyIcon";
import FooterViewCounter from "@/components/viewCounter/FooterViewCounter";
import styles from "./Footer.module.css";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
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
    name: "Instagram",
    href: "https://www.instagram.com/william.a.hao/",
    Icon: InstagramIcon,
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/user/williamhao99",
    Icon: SpotifyIcon,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  function renderNavLinks() {
    const navLinks = [];
    for (let i = 0; i < NAV.length; i++) {
      const navItem = NAV[i];
      if (!navItem) continue;

      navLinks.push(
        <Link
          key={navItem.href}
          href={navItem.href}
          className={styles.navLink}
        >
          {navItem.label}
        </Link>,
      );
    }
    return navLinks;
  }

  function renderSocialLinks() {
    const socialLinks = [];
    for (let i = 0; i < SOCIALS.length; i++) {
      const social = SOCIALS[i];
      if (!social) continue;

      const Icon = social.Icon;
      socialLinks.push(
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label={social.name}
        >
          <Icon className={styles.icon} />
        </a>,
      );
    }
    return socialLinks;
  }

  return (
    <footer className={styles.footer}>
      <div className={"container " + styles.content}>
        <nav
          className={styles.nav}
          aria-label="Footer navigation"
        >
          {renderNavLinks()}
        </nav>

        <p className={styles.copyright}>
          © {currentYear} William Hao
          <FooterViewCounter />
        </p>

        <div className={styles.contact}>
          <a
            href="mailto:william.hao.55@gmail.com"
            className={styles.emailLink}
          >
            william.hao.55@gmail.com
          </a>

          <div
            className={styles.social}
            role="group"
            aria-label="Social links"
          >
            {renderSocialLinks()}
          </div>
        </div>
      </div>
    </footer>
  );
}
