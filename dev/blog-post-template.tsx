// Copy to app/blog/{slug}/page.tsx, then add its blogs.ts entry (sitemap reads it) and
// opengraph-image.tsx + twitter-image.tsx, or it shares with no image. h2 = deck, h3 = sections

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CodeBlock from "@/components/codeBlock/CodeBlock";
import Prose from "@/components/prose/Prose";
import ViewCounter from "@/components/viewCounter/ViewCounter";
import styles from "@/app/blog/BlogPost.module.css";

export const metadata: Metadata = {
  title: "Post Title",
  description: "Brief description for SEO and link previews.",
  alternates: {
    canonical: "https://willhao.com/blog/post-slug",
  },
  openGraph: {
    title: "Post Title",
    description: "Brief description for SEO and link previews.",
    url: "https://willhao.com/blog/post-slug",
    siteName: "Will Hao",
    type: "article",
  },
};

export default function PostNamePage() {
  return (
    <Prose>
      <Link
        href="/blog"
        className="back-link"
      >
        ← Back to Blog
      </Link>

      <h1>Post Title</h1>
      <h2>Subtitle or one-line deck describing the post.</h2>

      <div className={styles.meta}>
        <time dateTime="YYYY-MM-DD">Month DD, YYYY</time>
        <span className={styles.dot}>·</span>
        <ViewCounter slug="blog-post-slug" />
      </div>

      <p>
        Opening paragraph. Inline code like <code>useState</code> renders in
        mono brand blue. Inline links to{" "}
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          other resources
        </a>{" "}
        get the muted underline at rest, brand-blue on hover.
      </p>

      <h3>A Section Header</h3>
      <p>
        Body paragraph. Use <code>h3</code> for section headers - h2 is reserved
        for the deck above the meta line. Lists work as expected:
      </p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>

      {/* Optional: Featured image
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

      {/* Optional: Code block (Shiki, github-dark-dimmed theme)
      <CodeBlock
        code={"const greeting = \"hello, world\";"}
        lang="typescript"
      />
      */}

      <Link
        href="/blog"
        className={"back-link " + styles.backBottom}
      >
        ← Back to Blog
      </Link>
    </Prose>
  );
}
