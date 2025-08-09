import { PageHeader, PageLayout, SectionWrapper } from "@/components";

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
        <div className="page-content">
          <p>Description for the second project.</p>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
}
