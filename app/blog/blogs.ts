export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  link: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Freshman year of college",
    slug: "freshman-year-of-college",
    excerpt: "A reflection and recap of my freshman year.",
    date: "May 12 2025",
    link: "/blog/freshman-year-of-college",
  },
  {
    title: "Book Reviews",
    slug: "book-reviews",
    excerpt: "Book reviews of all types.",
    date: "May 15 2025",
    link: "/blog/book-reviews",
  },
];
