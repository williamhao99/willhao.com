"use client";

// components/NavigationBar.js
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// theme toggle icon
function ThemeToggleIcon() {
  return (
    <div className="theme-toggle-icon">
      <div className="moon-or-sun">
        <div className="moon-mask"></div>
      </div>
    </div>
  );
}

// main navigation component
export default function NavigationBar() {
  const [theme, setTheme] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // theme initialization & system preference handling
  useEffect(() => {
    // check system preference with fallback
    const prefersDark = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
    
    // safe localStorage access
    const getSavedTheme = () => {
      try {
        return localStorage.getItem("theme");
      } catch (error) {
        console.warn("localStorage not available:", error);
        return null;
      }
    };

    const savedTheme = getSavedTheme();

    // use system if no saved theme
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsMounted(true);

    // listen for system changes
    const mediaQuery = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    
    const handleChange = (e) => {
      if (!getSavedTheme()) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    if (mediaQuery) {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, []);

  // toggle between light/dark theme
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

  // check if link is active
  const isActiveLink = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // navigation links
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
              src="/favicons/william-hao-banner.png"
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
            <img
              src="/images/profile-photo.jpg"
              alt="Will Hao"
              className="profile-image"
              // fallback to initials on error
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
