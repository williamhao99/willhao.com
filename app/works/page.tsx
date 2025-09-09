import { projects } from "./projects";
import WorkCard from "@/components/workCards/WorkCard";
import styles from "./page.module.css";

export default function WorksPage() {
  function renderProjects() {
    const items = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      if (!project) continue;
      items.push(<WorkCard key={project.id} project={project} />);
    }
    return items;
  }

  return (
    <>
      <h1>Works</h1>
      <h2>Personal and academic projects.</h2>

      <section className={styles.projectsSection}>
        <div className={styles.projectsGrid}>{renderProjects()}</div>
      </section>
    </>
  );
}
