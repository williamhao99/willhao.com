import Link from "next/link";
import LinkedInIcon from "./icons/LinkedInIcon";
import InstagramIcon from "./icons/InstagramIcon";
import GitHubIcon from "./icons/GitHubIcon";
import SpotifyIcon from "./icons/SpotifyIcon";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/william-a-hao/",
    Icon: LinkedInIcon,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/william.a.hao/",
    Icon: InstagramIcon,
  },
  { name: "GitHub", url: "https://github.com/williamhao99", Icon: GitHubIcon },
  {
    name: "Spotify",
    url: "https://open.spotify.com/user/williamhao99?si=a55b81b68fab41dc",
    Icon: SpotifyIcon,
  },
];

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container medium">
        <div className="wave-separator" />

        <div className="footer-main">
          <div className="footer-section">
            <h2 className="footer-title">Explore</h2>
            <nav className="footer-nav">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="footer-link">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-section">
            <h2 className="footer-title">Connect</h2>
            <div className="social-links">
              {socialLinks.map(({ name, url, Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={name}
                >
                  <Icon size={20} />
                  <span className="social-label">{name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="wave-separator" />

        <div className="footer-bottom footer-copy">
          <span>© {currentYear} William Hao. Made with code.</span>
        </div>
      </div>
    </footer>
  );
}
