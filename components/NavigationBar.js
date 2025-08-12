"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/config.public";

export default function NavigationBar() {
  const [theme, setTheme] = useState("dark");
  const [isMounted, setIsMounted] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const pathname = usePathname();

  // Initialize theme from localStorage on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem?.("theme");
    const initialTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!isMounted) return;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem?.("theme", newTheme);
  };

  // Check if navigation link matches current page
  const isActiveLink = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          {navLinks.map(({ href, label }) => {
            const isActive = isActiveLink(href);
            return (
              <Link
                key={href}
                href={href}
                className={["nav-link", isActive && "active"]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
          <button
            className="theme-toggle icon-btn"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <div className="theme-toggle-icon">
              <div className="moon-or-sun">
                <div className="moon-mask" />
              </div>
            </div>
          </button>
        </nav>

        <div className="head-separator">
          <div className="wave-separator" />
        </div>

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
