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
    const techBadges = [];
    for (let i = 0; i < project.tech.length; i++) {
      const tech = project.tech[i];
      if (!tech) continue;
      techBadges.push(
        <span key={tech} className={styles.techBadge}>
          {tech}
        </span>,
      );
    }

    const statusClass = styles.status + " " + getStatusClass(project.status);

    return (
      <>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.date && <time className={styles.date}>{project.date}</time>}
        </div>
        <div>
          <p className={styles.description}>{project.description}</p>
          {project.award && <p className={styles.awardText}>{project.award}</p>}
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.techStack}>{techBadges}</div>
          <span className={statusClass}>{project.status}</span>
        </div>
      </>
    );
  }

  if (project.link) {
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

  return (
    <article className={styles.card} aria-label={project.title + " project"}>
      {renderContent()}
    </article>
  );
}
