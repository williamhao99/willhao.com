import Link from "next/link";
import type { Project } from "@/app/works/projects";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";
import LinkIcon from "@/components/icons/LinkIcon";
import styles from "./WorkListItem.module.css";

interface WorkListItemProps {
  project: Project;
}

export default function WorkListItem({ project }: WorkListItemProps) {
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
        <div className={styles.left}>
          <h3 className={styles.title}>{project.title}</h3>
          {project.date && <time className={styles.date}>{project.date}</time>}
        </div>
        <div className={styles.right}>
          <span className={styles.description}>{project.description}</span>
          {project.award && (
            <span className={styles.award}>{project.award}</span>
          )}
        </div>
        <span
          className={styles.icon}
          aria-hidden="true"
        >
          {renderIcon()}
        </span>
      </>
    );
  }

  if (isExternal) {
    return (
      <a
        href={project.link}
        className={styles.item}
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
      className={styles.item}
      aria-label={project.title + " project"}
    >
      {renderContent()}
    </Link>
  );
}
