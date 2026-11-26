import type { Metadata } from "next";
import Link from "next/link";
import BackLink from "@/components/backLink/BackLink";
import Ledger from "@/components/ledger/Ledger";
import { blogPosts } from "@/app/blog/blogs";
import ledger from "@/components/ledger/Ledger.module.css";
import status from "@/app/status.module.css";

export const metadata: Metadata = {
  title: "Blog",
  alternates: {
    canonical: "https://willhao.com/blog",
  },
  openGraph: {
    url: "https://willhao.com/blog",
    siteName: "Will Hao",
    type: "website",
  },
};

if (blogPosts.length === 0) {
  metadata.robots = { index: false, follow: true };
}

export default function BlogPage() {
  let content = <p className={status.message}>Nothing here yet.</p>;
  if (blogPosts.length > 0) {
    const rows = [];
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      if (!post) continue;

      rows.push(
        <li
          key={post.slug}
          className={ledger.row}
        >
          <span className={ledger.when}>{post.date}</span>
          <div>
            <Link
              href={post.link}
              className={ledger.name + " " + ledger.rowLink}
            >
              {post.title}
              <span
                className={ledger.mark}
                aria-hidden="true"
              >
                →
              </span>
            </Link>
            <div className={ledger.detail}>{post.excerpt}</div>
          </div>
        </li>,
      );
    }
    content = <Ledger>{rows}</Ledger>;
  }

  return (
    <>
      <BackLink
        href="/"
        label="Back to home"
      />
      <h1>Blog</h1>
      {content}
    </>
  );
}
