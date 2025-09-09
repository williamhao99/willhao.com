import Link from "next/link";
import type { Project } from "@/app/works/projects";
import styles from "./WorkCard.module.css";

interface WorkCardProps {
  project: Project;
}

export default function WorkCard({ project }: WorkCardProps) {
  function getStatusClass(status: Project["status"]) {
    if (status === "complete") {
      return styles.statusComplete;
    }
    if (status === "in progress") {
      return styles.statusInProgress;
    }
    if (status === "planned") {
      return styles.statusPlanned;
    }
    return "";
  }

  function renderTechBadges() {
    const badges = [];
    for (let i = 0; i < project.tech.length; i++) {
      const tech = project.tech[i];
      if (!tech) continue;

      badges.push(
        <span key={tech} className={styles.techBadge}>
          {tech}
        </span>,
      );
    }
    return badges;
  }

  const cardContent = (
    <>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{project.title}</h3>
        {project.date && <time className={styles.date}>{project.date}</time>}
      </div>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.cardFooter}>
        <div className={styles.meta}>
          <div className={styles.techStack}>{renderTechBadges()}</div>
          <span
            className={styles.status + " " + getStatusClass(project.status)}
          >
            {project.status}
          </span>
        </div>
      </div>
    </>
  );

  if (project.link) {
    return (
      <Link
        href={project.link}
        className={styles.card}
        aria-label={"View " + project.title + " project"}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={styles.card} aria-label={project.title + " project"}>
      {cardContent}
    </article>
  );
}
