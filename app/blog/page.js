import React from "react";
import Link from "next/link";
import { PageHeader, PageLayout } from "@/components";

export const metadata = {
  title: "Blog",
  description:
    "Personal reflections of my time in college, experiences, hobbies, and anything else I think of.",
  openGraph: {
    title: "Will Hao - Blog",
    description:
      "Personal reflections of my time in college, experiences, hobbies, and anything else I think of.",
  },
};

const blogPosts = [
  {
    id: "2",
    title: "(WIP) Personal health and fitness", // TODO: finish
    slug: "personal-health-and-fitness",
    excerpt:
      "Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated.",
    published_at: "2025-05-15T18:30:00.000Z",
    visibility: "public",
    type: "post",
    status: "published",
  },
  {
    id: "1",
    title: "Freshman year of college",
    slug: "freshman-year",
    excerpt:
      "A reflection and recap of my freshman year (Fall 2024 & Spring 2025), covering courses, extracurriculars, and personal growth.",
    published_at: "2025-05-12T18:30:00.000Z",
    visibility: "public",
    type: "post",
    status: "published",
  },
];

// Parse ISO date strings with fallback for invalid dates
const parseDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

export default function Blog() {
  // Filter and sort posts by publish date (newest first)
  const publishedPosts = blogPosts
    .filter((post) => post.type === "post" && post.status === "published")
    .sort((a, b) => parseDate(b.published_at) - parseDate(a.published_at));

  // Group posts by publication year
  const postsByYear = publishedPosts.reduce((groups, post) => {
    const year = parseDate(post.published_at).getFullYear();
    return { ...groups, [year]: [...(groups[year] || []), post] };
  }, {});

  const sortedYears = Object.keys(postsByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <PageLayout>
      <PageHeader
        title="Blog"
        description="Personal reflections of my time in college, experiences, hobbies, and anything else I think of."
        isHero
      />

      <section className="section-wrap">
        <div className="container medium post-feed">
          {sortedYears.map((year) => (
            <React.Fragment key={year}>
              <h2 className="section-title blog-year-label">{year}</h2>
              {postsByYear[year].map((post) => {
                const date = parseDate(post.published_at);
                const dayMonth = date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                });

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="feed"
                    aria-label={post.title}
                  >
                    <h3 className="body-1 feed-title">{post.title}</h3>
                    {post.excerpt && (
                      <p className="feed-excerpt">
                        {post.excerpt.substring(0, 100)}...
                      </p>
                    )}
                    <div className="dot-spacer" />
                    <div className="feed-right">
                      <svg
                        className={`icon feed-visibility feed-visibility-${post.visibility || "public"}`}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M12.729 1.2l3.346 6.629 6.44.638-4.2 4.478 1.47 7.027L12 16.13 4.215 19.97l1.47-7.027-4.2-4.478 6.44-.638L12.729 1.2zM12 3.209L9.62 8.13l-5.512.55 3.561 3.795-1.241 5.947L12 15.387l5.572 3.035-1.241-5.947 3.561-3.795-5.512-.55L12 3.209z" />
                      </svg>
                      <time
                        className="body-1 feed-calendar"
                        dateTime={date.toISOString()}
                      >
                        {dayMonth}
                      </time>
                      <span className="feed-icon" aria-hidden="true">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
