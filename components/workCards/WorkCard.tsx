import Link from "next/link";
import type { Project } from "@/app/works/projects";
import styles from "./WorkCard.module.css";

interface WorkCardProps {
  project: Project;
}

export default function WorkCard({ project }: WorkCardProps) {
  function getStatusClass(status: Project["status"]) {
    if (status === "complete") return styles.statusComplete;
    if (status === "in progress") return styles.statusInProgress;
    if (status === "planned") return styles.statusPlanned;
    return "";
  }

  function renderContent() {
    const statusClass = styles.status + " " + getStatusClass(project.status);

    return (
      <>
        <span className={statusClass}>{project.status}</span>
        <div className={styles.cardContent}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.date && <time className={styles.date}>{project.date}</time>}
        </div>
        <p className={styles.description}>{project.description}</p>
        {project.award && <p className={styles.awardText}>{project.award}</p>}
      </>
    );
  }

  const isExternal = project.link.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={project.link}
        className={styles.card}
        aria-label={project.title + " project"}
        target="_blank"
        rel="noopener noreferrer"
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <Link
      href={project.link}
      className={styles.card}
      aria-label={project.title + " project"}
    >
      {renderContent()}
    </Link>
  );
}
