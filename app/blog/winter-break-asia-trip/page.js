/**
 * CONTENT PAGE: Winter Break Asia Trip
 *
 * Route: /blog/winter-break-asia-trip
 */

import { NavigationBar, Footer, PageHeader } from "../../../components";
import PdfViewer from "../../../components/PdfViewer";

export const metadata = {
  title: "Winter break Asia trip",
  description:
    "My winter break trip to Asia. Highlights, reflections, and cool food.",
};

export default function WinterBreakAsiaTrip() {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="(WIP) Winter break Asia trip" // TODO: WRITE THE POST
            description="My winter break trip to Asia. Highlights, reflections, and cool food."
            isHero={true}
          />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <h2 className="h2">China</h2>

                <h3 className="h3">Highlights</h3>

                <h3 className="h3">Visiting Family</h3>

                <div className="content-separator"></div>

                <h2 className="h2">Japan</h2>

                <h3 className="h3">Tokyo Adventures</h3>

                <h3 className="h3">More Food</h3>

                <div className="content-separator"></div>

                <h2 className="h2">Reflections</h2>
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
