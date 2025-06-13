/**
 * BASE SITE PAGE: Blog Listing
 *
 * Archive-style listing of all blog posts.
 * Organized by date with links to individual posts.
 */

import Link from "next/link";
import { PageHeader, NavigationBar, Footer } from "../../components";

export const metadata = {
  title: "Blog",
  description: "Personal reflections of my time in college, experiences, hobbies, and anything else I think of.",
};

// Placeholder blog posts for demo purposes
const placeholderPosts = [
  {
    id: "1",
    title: "Placeholder Post",
    slug: "this-page-does-not-exist",
    excerpt:
      "This is a placeholder blog post. Your actual content will appear here once you start writing.",
    published_at: "2024-12-15T10:00:00.000Z",
    visibility: "public",
    type: "post",
    status: "published",
  },
];

export default function Blog() {
  // Filter only published posts (all our placeholders are published)
  const publishedPosts = placeholderPosts.filter(
    (post) => post.type === "post" && post.status === "published",
  );

  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          {/* Page Header */}
          <PageHeader
            title="Blog"
            description="Personal reflections of my time in college, experiences, hobbies, and anything else I think of."
            isHero={true}
          />

          {/* Blog Feed */}
          <section className="section-wrap">
            <div className="container medium">
              <div className="post-feed">
                {publishedPosts.map((post, index) => {
                  const date = new Date(post.published_at);
                  const year = date.getFullYear();
                  const dayMonth = date.toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                  });

                  return (
                    <article
                      key={post.id}
                      className={`feed blog-wrapper blog-post-year-${year}`}
                    >
                      {/* Date wrapper - always shown for blog style */}
                      <div className="blog-date-wrapper">
                        <div className="section-title blog-year-label">
                          {year} BLOG
                        </div>
                      </div>

                      {/* Post Content */}
                      <div
                        className="feed-wrapper"
                        style={{ position: "relative" }}
                      >
                        <h2 className="body-1 feed-title">{post.title}</h2>
                        {post.excerpt && (
                          <div className="feed-excerpt">
                            {post.excerpt.substring(0, 100)}...
                          </div>
                        )}
                        <div className="dot-spacer"></div>
                        <div className="feed-right">
                          <div
                            className={`feed-visibility feed-visibility-${post.visibility || "public"}`}
                          >
                            <svg
                              className="icon"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12.729 1.2l3.346 6.629 6.44.638-4.2 4.478 1.47 7.027L12 16.13 4.215 19.97l1.47-7.027-4.2-4.478 6.44-.638L12.729 1.2zM12 3.209L9.62 8.13l-5.512.55 3.561 3.795-1.241 5.947L12 15.387l5.572 3.035-1.241-5.947 3.561-3.795-5.512-.55L12 3.209z" />
                            </svg>
                          </div>
                          <time
                            className="body-1 feed-calendar"
                            dateTime={date.toISOString()}
                          >
                            {dayMonth}
                          </time>
                          <div className="feed-icon">→</div>
                        </div>
                        <Link
                          href={`/blog/post1-placeholder-link`}
                          className="u-permalink"
                          aria-label={post.title}
                        ></Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
