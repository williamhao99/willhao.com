/**
 * BASE SITE PAGE: Works/Portfolio
 *
 * Showcase page for projects and work experience.
 * Links to individual project pages and content.
 */

import { PageHeader, PageLayout, SectionWrapper } from "../../components";
import Link from "next/link";

export const metadata = {
  title: "Works",
  description:
    "A list of projects I've created, and my work experience history.",
  openGraph: {
    title: "Will Hao - Works",
    description:
      "A list of projects I've created, and my work experience history.",
  },
};

export default function Works() {
  return (
    <PageLayout>
      {/* Page Header */}
      <PageHeader
        title="Works"
        description="A list of projects I've created, and my work experience history."
        isHero={true}
      />

      {/* Personal Projects Section */}
      <SectionWrapper className="section-personal-project">
        <div className="blog-year-label">
          <h2 className="section-title">Creating</h2>
        </div>
        <div className="cards kg-grid kg-grid-2col">
          <div className="card">
            <div className="card-wrapper">
              <h3 className="h3 card-title">
                UT Math Directed Reading Program Presentation
                <span className="card-arrow">↗</span>
              </h3>
              <div className="sub-heading card-excerpt">
                The math talk and presentation I gave for the UT Math DRP
                Symposium on April 24, 2025, along with my personal experiences
                and takeaways.
              </div>
            </div>
            <Link
              href="/works/drp-math-talk"
              className="u-permalink"
              aria-label="UT Math Directed Reading Program Presentation"
            ></Link>
          </div>
          <div className="card">
            <div className="card-wrapper">
              <h3 className="h3 card-title">
                Project Placeholder 2<span className="card-arrow">↗</span>
              </h3>
              <div className="sub-heading card-excerpt">
                Placeholder description.
              </div>
            </div>
            <Link
              href="/works/project2-placeholder-link"
              className="u-permalink"
              aria-label="Project Placeholder 2"
            ></Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Experience Section */}
      <SectionWrapper className="experiences section-experiences">
        <div className="blog-year-label">
          <h2 className="section-title">Experience</h2>
        </div>
        <div className="experience-item">
          <h3 className="h3">Job Title placeholder</h3>
          <p className="sub-heading">Work experience details</p>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
}
