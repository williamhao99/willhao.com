import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://willhao.com";

interface SitemapItem {
  path: string;
  lastModified: string;
  changeFrequency: "monthly" | "yearly";
  priority: number;
}

const dates = {
  home: "2025-05-10",
  about: "2025-09-05",
  works: "2025-09-21",
  blogIndex: "2025-05-15",
  utMathDrp: "2025-04-25",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const items: SitemapItem[] = [
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
    // Project pages
    {
      path: "/works/ut-math-drp",
      lastModified: dates.utMathDrp,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  // Blog posts are derived from blogs.ts so new posts are picked up automatically
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (!post) continue;
    items.push({
      path: post.link,
      lastModified: post.lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

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
