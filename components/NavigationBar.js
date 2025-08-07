"use client";

// components/NavigationBar.js
import Link from "next/link";
import Image from "next/image";
import bannerImg from "../public/favicons/william-hao-banner.png";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Theme toggle icon
function ThemeToggleIcon() {
  return (
    <div className="theme-toggle-icon">
      <div className="moon-or-sun">
        <div className="moon-mask"></div>
      </div>
    </div>
  );
}

// Navigation bar
export default function NavigationBar() {
  const [theme, setTheme] = useState("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const pathname = usePathname();

  // Theme: default dark, prefer saved
  useEffect(() => {
    let initialTheme = "dark";
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") initialTheme = saved;
    } catch {}
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsMounted(true);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (!isMounted || theme === null) return;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    // safe localStorage save
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn("Failed to save theme:", error);
    }
  };

  // Active link helper
  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/works", label: "Works" },
    { href: "/blog", label: "Blog" },
    { href: "/now", label: "Now" },
  ];

  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="header-brand">
          <Link href="/" className="header-logo">
            <Image
              src={bannerImg}
              alt="William Hao"
              width={200}
              height={50}
              priority
              className="logo-image"
            />
          </Link>
          <div className="sub-heading tagline">
            UT Austin '28, Computer Science + Mathematics
          </div>
        </div>

        <nav className="header-menu">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={isActiveLink(href) ? "nav-link active" : "nav-link"}
              aria-current={isActiveLink(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <button
            className="theme-toggle icon-btn"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <ThemeToggleIcon />
          </button>
        </nav>

        {/* Wave separator positioned right below nav.header-menu */}
        <div className="head-separator">
          <div className="wave-separator"></div>
        </div>

        {/* Profile Photo - Independent Element */}
          <div className="header-profile">
            <div className="profile-photo">
              {!profileImageError ? (
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Will Hao"
                  fill
                  sizes="(max-width: 767px) 6.5rem, 12rem"
                  className="profile-image"
                  onError={() => setProfileImageError(true)}
                  priority
                />
              ) : (
                <div className="profile-ph">WH</div>
              )}
            </div>
          </div>
      </div>
    </header>
  );
}
