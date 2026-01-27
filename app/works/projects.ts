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
    id: "pm-tradingdesk",
    title: "Prediction Market Trading Desk",
    description:
      "Personal trading infrastructure for Kalshi and Polymarket prediction markets",
    link: "https://github.com/williamhao99/pm-tradingdesk",
    date: "Oct 2024 - Present",
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
