import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
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
                sizes="280px"
              />
            </Link>
            <p className={styles.tagline}>
              UT Austin &apos;28, Computer Science + Mathematics
            </p>
          </div>

          <Image
            src="/images/profile-photo.jpg"
            alt="William Hao"
            width={120}
            height={120}
            priority
            className={styles.profilePhoto}
            sizes="120px"
          />
        </div>
      </div>
    </header>
  );
}
