import PageHeader from "@/components/PageHeader";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata = {
  title: "(WIP) Personal health and fitness",
  description:
    "Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated.",
};

export default function PersonalHealthAndFitness() {
  return (
    <PageLayout>
      <PageHeader
        title="(WIP) Personal health and fitness" // TODO: WRITE THE POST
        description="Knowledge I've learned about sports, fitness, weightlifting, and more throughout my life. This page will be continually updated."
        isHero={true}
      />
      <SectionWrapper className="page-content">
        <h2 className="h2">Why I Started</h2>

        <div className="content-separator"></div>

        <h2 className="h2">Current Routine</h2>

        <div className="content-separator"></div>

        <h2 className="h2">Nutrition, Recovery, and Sleep</h2>

        <div className="content-separator"></div>

        <h2 className="h2">Mindset</h2>

        <div className="content-separator"></div>

        <h2 className="h2">Other information that has helped me</h2>
      </SectionWrapper>
    </PageLayout>
  );
}
