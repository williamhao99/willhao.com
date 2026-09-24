import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogs";

const siteUrl = "https://willhao.com";

const dates = {
  home: "2026-08-17",
  about: "2026-08-17",
  works: "2026-08-18",
  blogIndex: "2026-06-10",
  utMathDrp: "2026-08-17",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    // Main pages
    {
      url: siteUrl + "/",
      lastModified: dates.home,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: siteUrl + "/about",
      lastModified: dates.about,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl + "/works",
      lastModified: dates.works,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl + "/blog",
      lastModified: dates.blogIndex,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Project pages
    {
      url: siteUrl + "/works/ut-math-drp",
      lastModified: dates.utMathDrp,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Blog posts are derived from blogs.ts so new posts are picked up automatically
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (!post) continue;
    entries.push({
      url: siteUrl + post.link,
      lastModified: post.lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  return entries;
}
