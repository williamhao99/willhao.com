/**
 * CONTENT PAGE: Winter Break Asia Trip
 *
 * Route: /blog/winter-break-asia-trip
 */

import {
  PageHeader,
  PageLayout,
  SectionWrapper,
  ContentLayout,
} from "../../../components";

export const metadata = {
  title: "(WIP) Winter break Asia trip",
  description:
    "My winter break trip to Asia. Highlights, reflections, and cool food.",
};

export default function WinterBreakAsiaTrip() {
  return (
    <PageLayout includePdfViewer={true}>
      <PageHeader
        title="(WIP) Winter break Asia trip" // TODO: WRITE THE POST
        description="My winter break trip to Asia. Highlights, reflections, and cool food."
        isHero={true}
      />
      <SectionWrapper>
        <ContentLayout>
          <h2 className="h2">China</h2>

          <h3 className="h3">Highlights</h3>

          <h3 className="h3">Visiting Family</h3>

          <div className="content-separator"></div>

          <h2 className="h2">Japan</h2>

          <h3 className="h3">Tokyo Adventures</h3>

          <h3 className="h3">More Food</h3>

          <div className="content-separator"></div>

          <h2 className="h2">Reflections</h2>
        </ContentLayout>
      </SectionWrapper>
    </PageLayout>
  );
}
