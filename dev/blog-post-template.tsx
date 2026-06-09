// Blog post template — copy to app/blog/{slug}/page.tsx, then:
//   - Add entry to app/blog/blogs.ts (title, slug, excerpt, date,
//     lastModified ISO date, link) — the sitemap derives the post's
//     entry from blogs.ts automatically; do NOT edit app/sitemap.ts
//   - Create app/blog/{slug}/opengraph-image.tsx + twitter-image.tsx
//     (reference app/opengraph-image.tsx)
//
// Conventions in use:
//   - <Prose> applies the content-page typography system (80ch measure,
//     refined headings, prose links, inline code styling, math tuning)
//   - "back-link" is a GLOBAL CSS class (app/globals.css), not a module class
//   - h1 = title, h2 = deck/subtitle, h3 = sections (h2 is RESERVED for the deck)
//   - ViewCounter slug must follow the "blog-{slug}" pattern
//   - <time dateTime="YYYY-MM-DD"> for machine-readable dates
//   - Inline <code> renders with the IN·6 style (mono, brand-blue, semibold)
//   - Inline links inside <p>/<li> get a subtle white underline + brand-blue hover
//   - <CodeBlock> renders Shiki-highlighted code blocks (server component)

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
        Opening paragraph. Inline code like <code>useState</code> renders in the
        IN·6 style. Inline links to{" "}
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
        Body paragraph. Use <code>h3</code> for section headers — h2 is reserved
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
    </Prose>
  );
}
