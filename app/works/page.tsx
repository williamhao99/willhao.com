import type { Metadata } from "next";
import { projects } from "@/app/works/projects";
import WorkListItem from "@/components/workListItem/WorkListItem";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Works",
  description: "Personal, academic, and hackathon projects.",
  alternates: {
    canonical: "https://willhao.com/works",
  },
  openGraph: {
    title: "Works",
    description: "Personal, academic, and hackathon projects.",
    url: "https://willhao.com/works",
  },
};

export default function WorksPage() {
  function renderProjects() {
    const items = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      if (!project) continue;
      items.push(
        <WorkListItem
          key={project.id}
          project={project}
        />,
      );
    }
    return items;
  }

  return (
    <>
      <h1>Works</h1>

      <section className={styles.projectsSection}>
        <div className={styles.worksList}>{renderProjects()}</div>
      </section>
    </>
  );
}
