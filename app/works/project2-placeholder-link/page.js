/**
 * CONTENT PAGE: Project Placeholder 2
 *
 * Route: /works/project2-placeholder-link
 */

import {
  PageHeader,
  PageLayout,
  SectionWrapper,
  ContentLayout,
} from "../../../components";

export const metadata = {
  title: "Project Placeholder 2",
  description: "A placeholder page for a second future project.",
};

export default function ProjectPlaceholder2Page() {
  return (
    <PageLayout>
      <PageHeader
        title="Project Placeholder 2"
        description="Placeholder description."
        isHero={true}
      />
      <SectionWrapper>
        <ContentLayout>
          <p>Description for the second project.</p>
        </ContentLayout>
      </SectionWrapper>
    </PageLayout>
  );
}
