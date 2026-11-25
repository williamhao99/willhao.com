export interface Project {
  title: string;
  description: string;
  // Omit for private work
  link?: string;
  date: string;
  award?: string;
  // Shown on the home page
  featured?: boolean;
}

// Newest first
export const projects: Project[] = [
  {
    title: "Prediction market trading",
    description: "Private automated systems for Kalshi and Polymarket",
    date: "Since 2026",
    featured: true,
  },
  {
    title: "Elo Boggle",
    description:
      "Mobile word game with timed matches against friends, and a custom Glicko-2-based rating system designed for it",
    link: "https://elo-boggle.pages.dev",
    date: "Since Oct 2026",
  },
  {
    title: "polymarket-watch",
    description:
      "Private dashboard for tracking Polymarket accounts and trades",
    link: "https://polymarket.willhao.com/demo/",
    date: "Sep - Oct 2026",
  },
  {
    title: "GooseChase - HackHackGoose 2026",
    description: "AI running coach that reads your Strava history",
    link: "https://github.com/williamhao99/GooseChase-HackHackGoose2026",
    date: "Apr 2026",
  },
  {
    title: "kalshi-tui",
    description: "Fast click trader for Kalshi markets, in Rust",
    link: "https://github.com/williamhao99/kalshi-tui",
    date: "Feb 2026",
  },
  {
    title: "Marvis - HackMIT 2025",
    description: "Scan a barcode, get repair steps on your smart glasses",
    link: "https://github.com/williamhao99/marvis-hackMIT2025",
    date: "Sep 2025",
    award: "1st Place - Mentra Track",
    featured: true,
  },
  {
    title: "UT Math Directed Reading Program",
    description: "Research on Benford's Law and ergodic theory",
    link: "/projects/ut-math-drp",
    date: "Jan - Apr 2025",
    featured: true,
  },
];
