import styles from "@/app/blog/BlogPost.module.css";

export default function BookReviewPage() {
  return (
    <article className={styles.content}>
      <h1>Book Reviews</h1>
      <time>May 15 2025</time>
      <p>
        Coming soon! I'll be sharing reviews of books I've been reading,
        including technical books, fiction, and non-fiction.
      </p>
    </article>
  );
}
