// Works/portfolio page

import { PageHeader, PageLayout, SectionWrapper } from "@/components";
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
      {/* header */}
      <PageHeader
        title="Works"
        description="A list of projects I've created, and my work experience history."
        isHero={true}
      />

      {/* projects */}
      <SectionWrapper className="section-personal-project">
        <h2 className="section-title">Creating</h2>
        <div className="kg-grid-2col">
          <article className="card">
            <h3 className="h3 card-title">
              UT Math Directed Reading Program Presentation
              <span className="card-arrow">↗</span>
            </h3>
            <div className="sub-heading card-excerpt">
              The math talk and presentation I gave for the UT Math DRP
              Symposium on April 24, 2025, along with my personal experiences
              and takeaways.
            </div>
            <Link
              href="/works/drp-math-talk"
              className="u-permalink"
              aria-label="UT Math Directed Reading Program Presentation"
            />
          </article>
          {/**
           * Hidden (WIP): Project Placeholder 2 — keep route live, hide card
           <article className="card">
             <h3 className="h3 card-title">
               Project Placeholder 2<span className="card-arrow">↗</span>
             </h3>
             <div className="sub-heading card-excerpt">
               Placeholder description.
             </div>
             <Link
               href="/works/project2-placeholder-link"
               className="u-permalink"
               aria-label="Project Placeholder 2"
             />
           </article>
           */}
        </div>
      </SectionWrapper>

      {/* experience */}
      <SectionWrapper className="section-experiences">
        <h2 className="section-title">Experience</h2>
        <div className="experience-item">
          <h3 className="h3">Job Title placeholder</h3>
          <p className="sub-heading">Work experience details</p>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
}
