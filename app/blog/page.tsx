import Link from "next/link";
import styles from "./Blog.module.css";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "Freshman year of college",
    slug: "freshman-year-of-college",
    excerpt: "A reflection and recap of my freshman year.",
    date: "May 12 2025",
  },
  {
    title: "Book Review",
    slug: "book-review",
    excerpt: "Incoming book reviews.",
    date: "May 15 2025",
  },
];

export const metadata = {
  title: "Blog | William Hao",
  description: "Notes on my experiences, learning, and hobbies.",
};

export default function BlogPage() {
  return (
    <>
      <h1>Blog</h1>
      <h2>Notes on my experiences, learning, and hobbies.</h2>

      <section className={styles.feed}>
        {blogPosts.map((post) => (
          <div key={post.slug} className={styles.post}>
            <div className={styles.postContent}>
              <Link
                href={`/blog/${post.slug}`}
                className={styles.postTitleLink}
              >
                <div className={styles.postTitle}>{post.title}</div>
              </Link>
              <p className={styles.postExcerpt}>
                {post.excerpt}
                <Link href={`/blog/${post.slug}`} className={styles.moreButton}>
                  More ›
                </Link>
              </p>
            </div>
            <time className={styles.postDate}>{post.date}</time>
          </div>
        ))}
      </section>
    </>
  );
}
