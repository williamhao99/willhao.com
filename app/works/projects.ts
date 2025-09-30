export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: "complete" | "in progress" | "planned";
  link: string;
  date: string;
  award?: string;
}

export const projects: Project[] = [
  {
    id: "marvis-hackmit-2025",
    title: "Marvis - HackMIT 2025",
    description: "AI-powered handyman for smart glasses on MentraOS",
    tech: ["MentraOS", "TypeScript", "Node.js/Bun"],
    status: "complete",
    link: "https://github.com/williamhao99/marvis-hackMIT2025",
    date: "Sep 2025",
    award: "1st Place Winner - Mentra Sponsor Track",
  },
  {
    id: "willhao.com portfolio",
    title: "willhao.com",
    description:
      "Full-stack portfolio with live API integrations and server-side caching",
    tech: ["Next.js", "TypeScript", "REST APIs"],
    status: "complete",
    link: "https://github.com/williamhao99/willhao.com",
    date: "Jun - Sep 2025",
  },
  {
    id: "ut-math-drp",
    title: "UT Math Directed Reading Program",
    description: "Math research on Benford's Law and dynamical systems",
    tech: ["Mathematics", "Statistics", "Research"],
    status: "complete",
    link: "/works/ut-math-drp",
    date: "Jan - Apr 2025",
  },
];
