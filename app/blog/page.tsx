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
    title: "Blog",
    url: "https://willhao.com/blog",
    siteName: "Will Hao",
    type: "website",
  },
};

// Noindex while empty
if (blogPosts.length === 0) {
  metadata.robots = { index: false, follow: true };
}

export default function BlogPage() {
  function renderPosts() {
    const rows = [];
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      if (!post) continue;

      rows.push(
        <li
          key={post.slug}
          className={ledger.row}
        >
          <time className={ledger.when}>{post.date}</time>
          <span>
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
            <span className={ledger.detail}>{post.excerpt}</span>
          </span>
        </li>,
      );
    }
    return rows;
  }

  let content = <p className={status.message}>Nothing here yet.</p>;
  if (blogPosts.length > 0) {
    content = <Ledger loose>{renderPosts()}</Ledger>;
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
