"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { clsx } from "@/lib/utils";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
];

export default function Header() {
  const pathname = usePathname() || "/";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.left}>
            <Link href="/" aria-label="Home" className={styles.logo}>
              <Image
                src="/images/william-hao-banner.png"
                alt="William Hao"
                fill
                priority
                className={styles.logoImage}
              />
            </Link>
            <p className={styles.tagline}>CS and Math '28 @ UT Austin</p>
          </div>

          <nav className={styles.navigation} aria-label="Main navigation">
            <ul className={styles.navList} role="list">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={clsx(
                      styles.navLink,
                      isActive(href) && styles.active,
                    )}
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
