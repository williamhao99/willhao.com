/**
 * BASE SITE PAGE: Works/Portfolio
 *
 * Showcase page for projects and work experience.
 * Links to individual project pages and content.
 */

import { PageHeader, NavigationBar, Footer } from "../../components";
import Link from "next/link";

export const metadata = {
  title: "Works",
  description: "A list of projects I've created, and my work experience history.",
  openGraph: {
    title: "Will Hao - Works",
    description: "A list of projects I've created, and my work experience history.",
  },
};

export default function Works() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          {/* Page Header */}
          <PageHeader
            title="Works"
            description="A list of projects I've created, and my work experience history."
            isHero={true}
          />

          {/* Personal Projects Section */}
          <section className="section-wrap section-personal-project">
            <header className="feed-header container medium">
              <div className="feed-header">
                <h2 className="section-title feed-header-title">Creating</h2>
              </div>
            </header>
            <div className="cards kg-grid kg-grid-2col container medium">
              <div className="card">
                <div className="card-wrapper">
                  <h3 className="h3 card-title">
                    UT Math Directed Reading Program Presentation
                    <span className="card-arrow">↗</span>
                  </h3>
                  <div className="sub-heading card-excerpt">
                    The math talk and presentation I gave for the UT Math DRP
                    Symposium on April 24, 2025, along with my personal
                    experiences and takeaways.
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
          </section>

          {/* Experience Section */}
          <section className="section-wrap experiences section-experiences">
            <header className="feed-header container medium">
              <div className="feed-header">
                <h2 className="section-title feed-header-title">Experience</h2>
              </div>
            </header>
            <div className="container medium">
              <div className="experience-item">
                <h3 className="h3">Job Title placeholder</h3>
                <p className="sub-heading">Work experience details</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
