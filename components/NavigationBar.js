"use client";

// components/NavigationBar.js
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

function ThemeToggleIcon() {
  return (
    <div className="theme-toggle-icon">
      <div className="moon-or-sun">
        <div className="moon-mask"></div>
      </div>
    </div>
  );
}

export default function NavigationBar({ posts = [], pages = [] }) {
  const [theme, setTheme] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check for system color scheme preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const savedTheme = localStorage.getItem("theme");

    // If no saved theme, use system preference
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = () => {
    if (!isMounted || theme === null) return;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/works", label: "Works" },
    { href: "/blog", label: "Blog" },
    { href: "/now", label: "Now" },
    { href: "/timeline", label: "Timeline" },
  ];

  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="header-brand">
          <div className="head-brand">
            <div className="header-logo-text">
              <Link href="/" className="header-logo">
                <figure className="head-logo">
                  <Image
                    src="/favicons/William Hao-3-2.png"
                    alt="William Hao"
                    width={200}
                    height={50}
                    priority
                    className="logo-image"
                  />
                </figure>
              </Link>
            </div>
            <div className="sub-heading tagline">
              UT Austin '28, Computer Science + Mathematics
            </div>
          </div>
        </div>

        <nav className="header-menu">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={isActiveLink(href) ? "nav-link active" : "nav-link"}
            >
              {label}
            </Link>
          ))}

          <div className="head-actions">
            <button
              className="theme-toggle icon-btn visible-desktop"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <ThemeToggleIcon />
            </button>
          </div>
        </nav>

        {/* Wave separator positioned right below nav.header-menu */}
        <div className="head-separator">
          <div className="wave-separator"></div>
        </div>

        {/* Profile Photo - Independent Element */}
        <div className="header-profile">
          <div className="profile-photo">
            <img
              src="/images/profile-photo.jpg"
              alt="Will Hao"
              className="profile-image"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
            <div className="profile-ph" style={{ display: "none" }}>
              WH
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
