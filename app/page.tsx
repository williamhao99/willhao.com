import Link from "next/link";
import Image from "next/image";
import WorkCard from "@/components/workCards/WorkCard";
import { projects } from "@/app/works/projects";
import ResumeIcon from "@/components/icons/ResumeIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import JavaIcon from "@/components/icons-tech/JavaIcon";
import PythonIcon from "@/components/icons-tech/PythonIcon";
import CppIcon from "@/components/icons-tech/CppIcon";
import ReactIcon from "@/components/icons-tech/ReactIcon";
import NextJSIcon from "@/components/icons-tech/NextJSIcon";
import TypeScriptIcon from "@/components/icons-tech/TypeScriptIcon";
import LinuxIcon from "@/components/icons-tech/LinuxIcon";
import GitIcon from "@/components/icons-tech/GitIcon";
import styles from "./page.module.css";

const QUICK_LINKS = [
  {
    name: "Resume",
    href: "/documents/William Hao - Resume September 2025.pdf",
    Icon: ResumeIcon,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/william-a-hao",
    Icon: LinkedInIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/williamhao99",
    Icon: GitHubIcon,
  },
];

const TECH_STACK = [
  { name: "Java", Icon: JavaIcon },
  { name: "Python", Icon: PythonIcon },
  { name: "C++", Icon: CppIcon },
  { name: "React", Icon: ReactIcon },
  { name: "Next.js", Icon: NextJSIcon },
  { name: "TypeScript", Icon: TypeScriptIcon },
  { name: "Linux", Icon: LinuxIcon },
  { name: "Git", Icon: GitIcon },
];

export default function Home() {
  function renderQuickLinks() {
    const links = [];
    for (let i = 0; i < QUICK_LINKS.length; i++) {
      const link = QUICK_LINKS[i];
      if (!link) continue;

      links.push(
        <a
          key={link.name}
          href={link.href}
          className={styles.quickLinkItem}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
        >
          <link.Icon />
          <span className={styles.quickLinkLabel}>{link.name}</span>
        </a>,
      );
    }
    return links;
  }

  function renderFeaturedProjects() {
    const cards = [];
    let count = 0;
    for (let i = 0; i < projects.length && count < 3; i++) {
      const project = projects[i];
      if (!project) continue;
      if (project.status === "complete") {
        cards.push(
          <WorkCard
            key={project.id}
            project={project}
          />,
        );
        count++;
      }
    }
    return cards;
  }

  function renderTechStack() {
    const icons = [];
    for (let i = 0; i < TECH_STACK.length; i++) {
      const tech = TECH_STACK[i];
      if (!tech) continue;
      const Icon = tech.Icon;
      icons.push(
        <div
          key={tech.name}
          className={styles.techStackItem}
        >
          <span className={styles.techStackLabel}>{tech.name}</span>
          <Icon />
        </div>,
      );
    }
    return icons;
  }

  return (
    <>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Will Hao — Portfolio</h1>
        <Image
          src="/favicons/android-chrome-512x512.png"
          alt=""
          className={styles.titleIcon}
          width={96}
          height={96}
          priority
        />
        <h2 className={styles.subtitle}>CS + Math '27 @ UT Austin</h2>
      </section>

      <section className={styles.introSection}>
        <p>
          I'm a current student at UT Austin interested in full-stack
          development, algorithmic trading, and AI/ML.
          <br />
          The languages I use most are Python, TypeScript/React, and Java,
          though I'm familiar with many others. <br />
          <Link
            href="/about"
            className={styles.textLink}
          >
            Learn more about me!
          </Link>
        </p>
        <div className={styles.quickLinks}>{renderQuickLinks()}</div>
      </section>

      <section className={styles.worksSection}>
        <h2>Featured Works</h2>
        <div className="projectsGrid">{renderFeaturedProjects()}</div>
        <Link href="/works">More works →</Link>
      </section>

      <div className={styles.techStackSection}>
        <h2>Tech Stack</h2>
        <div className={styles.techStackGrid}>{renderTechStack()}</div>
      </div>

      <section className={styles.blogSection}>
        <h2>
          Latest blog:{" "}
          <Link
            href="/blog/freshman-year-of-college"
            className={styles.textLink}
          >
            Freshman year of college
          </Link>
        </h2>
        <Link href="/blog">More blogs →</Link>
      </section>
    </>
  );
}
