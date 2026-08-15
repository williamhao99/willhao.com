export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  date: string;
  award?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "kalshi-tui",
    title: "kalshi-tui",
    description: "Web-based click trader for Kalshi prediction markets",
    link: "https://github.com/williamhao99/kalshi-tui",
    date: "Feb 2026",
    featured: true,
  },
  {
    id: "marvis-hackmit-2025",
    title: "Marvis - HackMIT 2025",
    description: "AI-powered handyman for smart glasses on MentraOS",
    link: "https://github.com/williamhao99/marvis-hackMIT2025",
    date: "Sep 2025",
    award: "1st Place Winner - Mentra Sponsor Track",
    featured: true,
  },
  {
    id: "ut-math-drp",
    title: "Benford's Law Research",
    description:
      "Undergraduate research on Benford's Law and ergodic theory through the UT Math Directed Reading Program",
    link: "/works/ut-math-drp",
    date: "Jan - Apr 2025",
    featured: true,
  },
  {
    id: "willhao.com portfolio",
    title: "willhao.com",
    description: "Full-stack portfolio with live API integrations",
    link: "https://github.com/williamhao99/willhao.com",
    date: "Jun - Sep 2025",
  },
];
