export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  link: string;
}

export const blogPosts: BlogPost[] = [
  // Example blog post template:
  // {
  //   title: "Post Title",
  //   slug: "post-slug",
  //   excerpt: "Brief description of the post.",
  //   date: "Month DD YYYY",
  //   link: "/blog/post-slug",
  // },
];
