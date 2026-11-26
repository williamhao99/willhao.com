import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogs";

const siteUrl = "https://willhao.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl + "/" },
    { url: siteUrl + "/projects" },
    { url: siteUrl + "/projects/ut-math-drp" },
  ];

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
