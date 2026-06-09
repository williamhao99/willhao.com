export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  lastModified: string; // ISO date (YYYY-MM-DD), used for the sitemap entry
  link: string;
}

export const blogPosts: BlogPost[] = [
  // Example blog post template:
  // {
  //   title: "Post Title",
  //   slug: "post-slug",
  //   excerpt: "Brief description of the post.",
  //   date: "Month DD YYYY",
  //   lastModified: "YYYY-MM-DD",
  //   link: "/blog/post-slug",
  // },
];
