/**
 * CONTENT PAGE: Personal Health and Fitness
 *
 * Route: /blog/personal-health-and-fitness
 */

import { NavigationBar, Footer, PageHeader } from "../../../components";
import PdfViewer from "../../../components/PdfViewer";

export const metadata = {
  title: "Personal health and fitness",
  description:
    "Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated.",
};

export default function PersonalHealthAndFitness() {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="(WIP) Personal health and fitness" // TODO: WRITE THE POST
            description="Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated."
            isHero={true}
          />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <h2 className="h2">Why I Started</h2>

                <div className="content-separator"></div>

                <h2 className="h2">Current Routine</h2>

                <div className="content-separator"></div>

                <h2 className="h2">Nutrition, Recovery, and Sleep</h2>

                <div className="content-separator"></div>

                <h2 className="h2">Mindset</h2>

                <div className="content-separator"></div>

                <h2 className="h2">Other information that has helped me</h2>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <PdfViewer />
    </div>
  );
}
