import type { Metadata } from "next";
import Link from "next/link";
import BackLink from "@/components/backLink/BackLink";
import CodeBlock from "@/components/codeBlock/CodeBlock";

const CODE =
  "function greet(name: string): string {\n" +
  '  return "Hello, " + name;\n' +
  "}\n" +
  "\n" +
  'console.log(greet("world"));';

export const metadata: Metadata = {
  title: "Hello, world",
  description: "Test blog",
  alternates: {
    canonical: "https://willhao.com/blog/hello-world",
  },
  openGraph: {
    title: "Hello, world",
    description: "Test blog",
    url: "https://willhao.com/blog/hello-world",
    siteName: "Will Hao",
    type: "article",
  },
};

export default function HelloWorldPage() {
  return (
    <article className="prose">
      <BackLink
        href="/blog"
        label="Back to blog"
      />

      <h1>Hello, world</h1>
      <p className="deck">Test blog</p>

      <p className="meta">
        <time dateTime="2026-11-24">November 24, 2026</time>
      </p>

      <p>Hello.</p>

      <CodeBlock
        code={CODE}
        lang="typescript"
      />

      <nav className="back">
        <Link href="/blog">← Blog</Link>
      </nav>
    </article>
  );
}
