import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogs";

const siteUrl = "https://willhao.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl + "/", lastModified: "2026-11-24" },
    { url: siteUrl + "/projects", lastModified: "2026-11-24" },
    { url: siteUrl + "/projects/ut-math-drp", lastModified: "2026-11-24" },
  ];

  // Blog, once it has posts
  let latest = "";
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (!post) continue;
    entries.push({ url: siteUrl + post.link, lastModified: post.lastModified });
    if (post.lastModified > latest) {
      latest = post.lastModified;
    }
  }
  if (latest) {
    entries.push({ url: siteUrl + "/blog", lastModified: latest });
  }

  return entries;
}
