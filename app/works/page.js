import PageHeader from "@/components/PageHeader";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
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
      <PageHeader
        title="Works"
        description="A list of projects I've created, and my work experience history."
        isHero
      />

      <SectionWrapper className="section-personal-project">
        <h2 className="section-title">Creating</h2>
        <div className="kg-grid-2col">
          <Link
            href="/works/drp-math-talk"
            className="card"
            aria-label="UT Math Directed Reading Program Presentation"
          >
            <h3 className="h3 card-title">
              UT Math Directed Reading Program Presentation
              <span className="card-arrow">↗</span>
            </h3>
            <p className="sub-heading card-excerpt">
              The math talk and presentation I gave for the UT Math DRP
              Symposium on April 24, 2025, along with my personal experiences
              and takeaways.
            </p>
          </Link>
          {/**
           * Hidden (WIP): Project Placeholder 2 — keep route live, hide card
           <Link
             href="/works/project2-placeholder-link"
             className="card"
             aria-label="Project Placeholder 2"
           >
             <h3 className="h3 card-title">
               Project Placeholder 2
               <span className="card-arrow">↗</span>
             </h3>
             <p className="sub-heading card-excerpt">
               Placeholder description.
             </p>
           </Link>
           */}
        </div>
      </SectionWrapper>

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
