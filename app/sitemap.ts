import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://willhao.com";

const dates = {
  home: "2025-05-10",
  about: "2025-09-05",
  works: "2025-09-21",
  blogIndex: "2025-05-15",
  freshmanPost: "2025-05-12",
  bookReviewPost: "2025-05-15",
  utMathDrp: "2025-04-25",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const items = [
    // Main pages
    {
      path: "/",
      lastModified: dates.home,
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      path: "/about",
      lastModified: dates.about,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/works",
      lastModified: dates.works,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/blog",
      lastModified: dates.blogIndex,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Blog posts
    {
      path: "/blog/freshman-year-of-college",
      lastModified: dates.freshmanPost,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      path: "/blog/book-review",
      lastModified: dates.bookReviewPost,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    // Project pages
    {
      path: "/works/ut-math-drp",
      lastModified: dates.utMathDrp,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  const sitemapEntries = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;
    sitemapEntries.push({
      url: siteUrl + item.path,
      lastModified: item.lastModified,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    });
  }

  return sitemapEntries;
}
