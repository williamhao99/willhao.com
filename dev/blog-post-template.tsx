// Blog post template. Copy to app/blog/[slug]/page.tsx and add an
// entry to app/blog/blogs.ts.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Prose from "@/components/prose/Prose";
import styles from "@/app/blog/BlogPost.module.css";

export const metadata: Metadata = {
  title: "Post Title",
  description: "Brief description for SEO.",
  alternates: {
    canonical: "https://willhao.com/blog/post-slug",
  },
  openGraph: {
    title: "Post Title",
    description: "Brief description for SEO.",
    url: "https://willhao.com/blog/post-slug",
  },
};

export default function PostNamePage() {
  return (
    <Prose>
      <Link
        href="/blog"
        className={styles.backLink}
      >
        ← Back to Blog
      </Link>
      <h1>Post Title</h1>
      <h2>Subtitle or brief description.</h2>
      <time>Month DD, YYYY</time>

      {/* Optional: Featured image */}
      {/*
      <figure className={styles.figure}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/image-name.jpg"
            alt="Image description"
            width={800}
            height={600}
            className={styles.image}
          />
        </div>
        <figcaption className={styles.figcaption}>
          Caption text
        </figcaption>
      </figure>
      */}

      <h3>Section Heading</h3>
      <p>Paragraph text goes here.</p>
    </Prose>
  );
}
