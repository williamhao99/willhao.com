import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/blog/BlogPost.module.css";

export const metadata: Metadata = {
  title: "Book reviews",
  description: "Book reviews.",
  alternates: {
    canonical: "https://willhao.com/blog/book-reviews",
  },
};

export default function BookReviewPage() {
  return (
    <article className={styles.content}>
      <Link
        href="/blog"
        className={styles.backLink}
      >
        ← Back to Blog
      </Link>
      <h1>Book Reviews</h1>
      <time>May 15 2025</time>
      <p>
        Coming soon! I'll be sharing reviews of books I've been reading,
        including technical books, fiction, and non-fiction.
      </p>
    </article>
  );
}
