import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Ledger from "@/components/ledger/Ledger";
import ProjectRows from "@/components/projectRows/ProjectRows";
import LiveRows from "@/components/liveRows/LiveRows";
import { projects } from "@/app/projects/projects";
import type { Project } from "@/app/projects/projects";
import { getCachedLive } from "@/lib/data/live";
import ledger from "@/components/ledger/Ledger.module.css";
import styles from "./page.module.css";

// Live rows need request-time data
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://willhao.com",
  },
};

const PROFILE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "William Hao",
    alternateName: "Will Hao",
    url: "https://willhao.com",
    sameAs: [
      "https://github.com/williamhao99",
      "https://www.linkedin.com/in/william-a-hao/",
    ],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "The University of Texas at Austin",
    },
  },
};

// Newest first
const EXPERIENCE = [
  {
    role: "Quantitative Trading Intern",
    company: "Optiver",
    date: "Summer 2027",
  },
  {
    role: "Software Engineering Intern",
    company: "Citi",
    date: "Jun - Aug 2026",
  },
];

// Update "junior" each fall
const INTRO =
  "Hi! I'm Will, a junior at UT Austin studying CS and math. I've always enjoyed solving puzzles and building things, mostly in software, finance, and machine learning.";

export default function Home() {
  function renderExperience() {
    const rows = [];
    for (let i = 0; i < EXPERIENCE.length; i++) {
      const entry = EXPERIENCE[i];
      if (!entry) continue;

      rows.push(
        <li
          key={entry.company + entry.date}
          className={ledger.row}
        >
          <span className={ledger.when}>{entry.date}</span>
          <span>
            <span className={ledger.name}>{entry.company}</span>
            <span className={ledger.detail}>{entry.role}</span>
          </span>
        </li>,
      );
    }
    return rows;
  }

  function featuredProjects() {
    const featured: Project[] = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      if (!project) continue;
      if (project.featured) {
        featured.push(project);
      }
    }
    return featured;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_SCHEMA) }}
      />
      <header className={styles.front}>
        <h1>Will Hao</h1>
        <nav
          className={styles.links}
          aria-label="Pages"
        >
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <span className={styles.knightSlot}>
          <Image
            src="/favicons/hero-knight-32x32.png"
            alt=""
            className={styles.knight}
            width={64}
            height={64}
            preload
          />
        </span>
      </header>
      <p>{INTRO}</p>

      <Ledger label="Experience">{renderExperience()}</Ledger>
      <Ledger label="Featured projects">
        <ProjectRows projects={featuredProjects()} />
      </Ledger>

      <section className={ledger.block}>
        <h2 className={ledger.label}>Interests</h2>
        <p className={styles.personal}>
          In my free time, I'm usually doing one of: lifting, running, tennis,
          pickleball, swimming, playing chess or osu!, or solving Rubik's cubes.
          Some live stats:
        </p>
        <ul
          className={ledger.ledger}
          role="list"
        >
          <LiveRows initialData={getCachedLive()} />
        </ul>
      </section>
    </>
  );
}
