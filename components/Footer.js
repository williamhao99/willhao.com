// components/Footer.js
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container medium">
        <div className="wave-separator"></div>

        {/* Enhanced Footer Content */}
        <div className="footer-main">
          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Explore</h3>
            <nav className="footer-nav">
              <Link href="/about" className="footer-link">
                About
              </Link>
              <Link href="/works" className="footer-link">
                Works
              </Link>
              <Link href="/blog" className="footer-link">
                Blog
              </Link>
              <Link href="/now" className="footer-link">
                Now
              </Link>
            </nav>
          </div>

          {/* Connect Section */}
          <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
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

        <div className="wave-separator"></div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-copy">
            <span>© {currentYear} William Hao. Made with code.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
