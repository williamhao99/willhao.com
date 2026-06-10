import Link from "next/link";
import type { Project } from "@/app/works/projects";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";
import LinkIcon from "@/components/icons/LinkIcon";
import styles from "./WorkCard.module.css";

interface WorkCardProps {
  project: Project;
}

export default function WorkCard({ project }: WorkCardProps) {
  const isExternal = project.link.startsWith("http");

  function renderIcon() {
    if (isExternal) {
      return <ExternalLinkIcon />;
    }
    return <LinkIcon />;
  }

  function renderContent() {
    return (
      <>
        <div className={styles.top}>
          <div className={styles.header}>
            <h3 className={styles.title}>{project.title}</h3>
            {project.date && (
              <time className={styles.date}>{project.date}</time>
            )}
          </div>
          <span
            className={styles.icon}
            aria-hidden="true"
          >
            {renderIcon()}
          </span>
        </div>
        <p className={styles.description}>{project.description}</p>
        {project.award && <p className={styles.award}>{project.award}</p>}
      </>
    );
  }

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
