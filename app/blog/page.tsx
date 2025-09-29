import Link from "next/link";
import { blogPosts } from "./blogs";
import styles from "./Blog.module.css";

export default function BlogPage() {
  function renderBlogPosts() {
    const posts = [];
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      if (!post) continue;

      posts.push(
        <div
          key={post.slug}
          className={styles.post}
        >
          <Link
            href={post.link}
            className={styles.postTitle}
          >
            {post.title}
          </Link>
          <p className={styles.postExcerpt}>
            {post.excerpt}
            <Link
              href={post.link}
              className={styles.moreButton}
            >
              More →
            </Link>
          </p>
          <time className={styles.postDate}>{post.date}</time>
        </div>,
      );
    }
    return posts;
  }

  return (
    <>
      <h1>Blog</h1>
      <section className={styles.feed}>{renderBlogPosts()}</section>
    </>
  );
}
