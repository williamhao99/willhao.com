import Link from "next/link";
import { socialLinks, footerNavLinks } from "@/lib/config.public";

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
              {footerNavLinks.map(({ href, label }) => (
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
