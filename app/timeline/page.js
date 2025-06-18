import { PageHeader, NavigationBar, Footer } from "../../components";

export const metadata = {
  title: "Timeline",
  description: "A timeline of my personal life, student, and career milestones.",
  openGraph: {
    title: "Will Hao - Timeline",
    description: "A timeline of my personal life, student, and career milestones.",
  },
};

export default function Timeline() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="Timeline"
            description="A timeline of my personal life, student, and career milestones."
            isHero={true}
          />

          <section className="section-wrap">
            <div className="container medium">
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
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
