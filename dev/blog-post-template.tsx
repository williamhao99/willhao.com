// Copy to app/blog/{slug}/page.tsx and add an entry in app/blog/blogs.ts

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BackLink from "@/components/backLink/BackLink";
import CodeBlock from "@/components/codeBlock/CodeBlock";

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
    <article className="prose">
      <BackLink
        href="/blog"
        label="Back to blog"
      />

      <h1>Post Title</h1>
      <p className="deck">Subtitle or one-line deck describing the post.</p>

      <p className="meta">
        <time dateTime="YYYY-MM-DD">Month DD, YYYY</time>
      </p>

      <p>
        Opening paragraph. Inline code like <code>useState</code> renders in
        mono. Inline links to{" "}
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          other resources
          <span className="visually-hidden"> (opens in new tab)</span>
        </a>{" "}
        get a thin underline at rest, blue on hover.
      </p>

      <h2>A Section Header</h2>
      <p>
        Body paragraph. Use <code>h2</code> for section headers. Lists work as
        expected:
      </p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>

      {/* Optional: Featured image
      <figure>
        <Image
          src="/images/image-name.jpg"
          alt="Image description"
          width={640}
          height={480}
        />
        <figcaption>Caption text</figcaption>
      </figure>
      */}

      {/* Optional: Code block
      <CodeBlock
        code={"const greeting = \"hello, world\";"}
        lang="typescript"
      />
      */}

      <nav className="back">
        <Link href="/blog">← Blog</Link>
      </nav>
    </article>
  );
}
