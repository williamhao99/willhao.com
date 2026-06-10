import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import WorkCard from "@/components/workCards/WorkCard";
import { projects } from "@/app/works/projects";
import ResumeIcon from "@/components/icons/ResumeIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://willhao.com",
  },
};

// Structured data tying the site to "William Hao" in search engines
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
      "https://linkedin.com/in/william-a-hao",
    ],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "The University of Texas at Austin",
    },
  },
};

const QUICK_LINKS = [
  {
    name: "Resume",
    href: "/documents/William Hao - resume.pdf",
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
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      if (!project) continue;
      if (project.featured) {
        cards.push(
          <WorkCard
            key={project.id}
            project={project}
          />,
        );
      }
    }
    return cards;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_SCHEMA) }}
      />
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Will Hao</h1>
        <Image
          src="/favicons/hero-knight-96x96.png"
          alt=""
          className={styles.titleIcon}
          width={96}
          height={96}
          unoptimized
          priority
        />
        <h2 className={styles.subtitle}>
          <span>CS + Math '28 @ UT Austin</span>
        </h2>
      </section>

      <section className={styles.introSection}>
        <div className={styles.quickLinks}>{renderQuickLinks()}</div>
      </section>

      <section className={styles.worksSection}>
        <h2 className={styles.worksHeading}>Featured Works</h2>
        <div className="projectsGrid">{renderFeaturedProjects()}</div>
        <Link
          href="/works"
          className={styles.moreLink}
        >
          More works →
        </Link>
      </section>
    </>
  );
}
