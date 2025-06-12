/**
 * CONTENT PAGE: Project Placeholder
 *
 * Route: /works/project1-placeholder-link
 */

import { NavigationBar, Footer, PageHeader } from "../../../components";

export const metadata = {
  title: "Project Placeholder",
  description: "A placeholder page for a future project.",
};

export default function ProjectPlaceholderPage() {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="Project Placeholder"
            description="Placeholder description"
            isHero={true}
          />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <p>Description</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
