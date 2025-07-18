import { PageHeader, PageLayout, SectionWrapper } from "../../components";

export const metadata = {
  title: "Timeline",
  description:
    "A timeline of my personal life, student, and career milestones.",
  openGraph: {
    title: "Will Hao - Timeline",
    description:
      "A timeline of my personal life, student, and career milestones.",
  },
};

export default function Timeline() {
  return (
    <PageLayout>
      <PageHeader
        title="Timeline"
        description="A timeline of my personal life, student, and career milestones."
        isHero={true}
      />

      <SectionWrapper>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">
              <span className="sub-heading">2024</span>
            </div>
            <div className="timeline-content">
              <h3 className="h3">Event</h3>
              <p className="body-1">•</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">
              <span className="sub-heading">2023</span>
            </div>
            <div className="timeline-content">
              <h3 className="h3">Event</h3>
              <p className="body-1">•</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">
              <span className="sub-heading">2022</span>
            </div>
            <div className="timeline-content">
              <h3 className="h3">Event</h3>
              <p className="body-1">•</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
}
