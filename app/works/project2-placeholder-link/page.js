/**
 * CONTENT PAGE: Project Placeholder 2
 *
 * Route: /works/project2-placeholder-link
 */

import { NavigationBar, Footer, PageHeader } from "../../../components";

export const metadata = {
  title: "Project Placeholder 2",
  description: "A placeholder page for a second future project.",
};

export default function ProjectPlaceholder2Page() {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="Project Placeholder 2"
            description="Placeholder description."
            isHero={true}
          />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <p>Description for the second project.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
