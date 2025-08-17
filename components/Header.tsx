"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.left}>
            <Link href="/" aria-label="Home" className={styles.logo}>
              <Image
                src="/images/william-hao-banner.png"
                alt="William Hao"
                width={280}
                height={70}
                priority
                className={styles.logoImage}
              />
            </Link>
            <p className={styles.tagline}>
              UT Austin &apos;28, Computer Science + Mathematics
            </p>
          </div>

          <nav className={styles.navigation}>
            <ul className={styles.navList}>
              <li>
                <Link
                  href="/about"
                  className={`${styles.navLink} ${isActive("/about") && styles.active}`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/works"
                  className={`${styles.navLink} ${isActive("/works") && styles.active}`}
                >
                  Works
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`${styles.navLink} ${isActive("/blog") && styles.active}`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/now"
                  className={`${styles.navLink} ${isActive("/now") && styles.active}`}
                >
                  Now
                </Link>
              </li>
            </ul>
          </nav>

          <Image
            src="/images/profile-photo.jpg"
            alt="William Hao"
            width={120}
            height={120}
            priority
            className={styles.profilePhoto}
          />
        </div>
      </div>
    </header>
  );
}
