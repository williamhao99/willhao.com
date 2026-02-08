"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname() || "/";

  function isActive(href: string): boolean {
    if (pathname === href || pathname.startsWith(href + "/")) {
      return true;
    }
    return false;
  }

  function getNavClasses(href: string) {
    if (isActive(href)) {
      return styles.navLink + " " + styles.active;
    }
    return styles.navLink;
  }

  function renderNavItems() {
    const navItems = [];
    for (let i = 0; i < NAV.length; i++) {
      const navItem = NAV[i];
      if (!navItem) continue;

      const href = navItem.href;
      const label = navItem.label;

      let ariaCurrent: "page" | undefined;
      if (isActive(href)) {
        ariaCurrent = "page";
      } else {
        ariaCurrent = undefined;
      }

      navItems.push(
        <li key={href}>
          <Link
            href={href}
            className={getNavClasses(href)}
            aria-current={ariaCurrent}
          >
            {label}
          </Link>
        </li>,
      );
    }
    return navItems;
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.left}>
            <Link
              href="/"
              aria-label="Home"
              className={styles.logo}
            >
              <Image
                src="/images/william-hao-banner.svg"
                alt="William Hao"
                fill
                priority
                className={styles.logoImage}
              />
            </Link>
          </div>

          <nav
            className={styles.navigation}
            aria-label="Main navigation"
          >
            <ul
              className={styles.navList}
              role="list"
            >
              {renderNavItems()}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
