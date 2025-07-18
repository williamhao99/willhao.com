/**
 * CONTENT PAGE: Personal Health and Fitness
 *
 * Route: /blog/personal-health-and-fitness
 */

import {
  PageHeader,
  PageLayout,
  SectionWrapper,
  ContentLayout,
} from "../../../components";

export const metadata = {
  title: "(WIP) Personal health and fitness",
  description:
    "Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated.",
};

export default function PersonalHealthAndFitness() {
  return (
    <PageLayout includePdfViewer={true}>
      <PageHeader
        title="(WIP) Personal health and fitness" // TODO: WRITE THE POST
        description="Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated."
        isHero={true}
      />
      <SectionWrapper>
        <ContentLayout>
          <h2 className="h2">Why I Started</h2>

          <div className="content-separator"></div>

          <h2 className="h2">Current Routine</h2>

          <div className="content-separator"></div>

          <h2 className="h2">Nutrition, Recovery, and Sleep</h2>

          <div className="content-separator"></div>

          <h2 className="h2">Mindset</h2>

          <div className="content-separator"></div>

          <h2 className="h2">Other information that has helped me</h2>
        </ContentLayout>
      </SectionWrapper>
    </PageLayout>
  );
}
