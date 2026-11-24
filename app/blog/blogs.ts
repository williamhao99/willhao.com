export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  lastModified: string; // YYYY-MM-DD
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
