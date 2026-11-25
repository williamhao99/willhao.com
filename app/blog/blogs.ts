export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string; // Mon DD YYYY
  lastModified: string; // YYYY-MM-DD
  link: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Hello, world",
    slug: "hello-world",
    excerpt: "Test blog",
    date: "Nov 24 2026",
    lastModified: "2026-11-24",
    link: "/blog/hello-world",
  },
];
