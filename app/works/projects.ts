export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: "complete" | "in progress" | "planned";
  link?: string;
  date?: string;
}

export const projects: Project[] = [
  {
    id: "ut-math-drp",
    title: "UT Math Directed Reading Program",
    description: "",
    tech: ["Mathematics", "Statistics", "Research"],
    status: "complete",
    link: "/works/ut-math-drp",
    date: "Jan - Apr 2025",
  },
  {
    id: "personal-portfolio",
    title: "willhao.com",
    description: "Personal portfolio",
    tech: ["Next.js", "TypeScript", "REST APIs"],
    status: "in progress",
    date: "Jun 2025 - Present",
  },
  {
    id: "hackmit-2025",
    title: "HackMIT upcoming project",
    description: "Project details to be determined.",
    tech: ["TBD"],
    status: "planned",
    date: "Sep 2025",
  },
];
