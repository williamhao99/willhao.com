import Link from "next/link";
import type { Project } from "@/app/projects/projects";
import ledger from "@/components/ledger/Ledger.module.css";

interface ProjectRowsProps {
  projects: Project[];
}

function renderName(project: Project) {
  if (!project.link) {
    return <span className={ledger.name}>{project.title}</span>;
  }

  const className = ledger.name + " " + ledger.rowLink;
  if (project.link.startsWith("/")) {
    return (
      <Link
        href={project.link}
        className={className}
      >
        {project.title}
        <span
          className={ledger.mark}
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    );
  }
  return (
    <a
      href={project.link}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {project.title}
      <span className="visually-hidden"> (opens in new tab)</span>
    </a>
  );
}

export default function ProjectRows({ projects }: ProjectRowsProps) {
  const rows = [];
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (!project) continue;

    let award = null;
    if (project.award) {
      award = (
        <span className={ledger.detail + " " + ledger.plain}>
          {project.award}
        </span>
      );
    }

    rows.push(
      <li
        key={project.title}
        className={ledger.row}
      >
        <span className={ledger.when}>{project.date}</span>
        <span>
          {renderName(project)}
          <span className={ledger.detail}>{project.description}</span>
          {award}
        </span>
      </li>,
    );
  }
  return <>{rows}</>;
}
