import type { Metadata } from "next";
import { projects } from "@/app/works/projects";
import WorkCard from "@/components/workCards/WorkCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Works",
  description: "Personal, academic, and hackathon projects.",
  alternates: {
    canonical: "https://willhao.com/works",
  },
};

export default function WorksPage() {
  function renderProjects() {
    const items = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      if (!project) continue;
      items.push(
        <WorkCard
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
      <h2>Personal, academic, and hackathon projects.</h2>

      <section className={styles.projectsSection}>
        <div className={"projectsGrid " + styles.worksGrid}>
          {renderProjects()}
        </div>
      </section>
    </>
  );
}
