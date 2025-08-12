import PageHeader from "@/components/PageHeader";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata = {
  title: "Now",
  description: "An updated page of what I'm currently working on.",
  openGraph: {
    title: "Will Hao - Now",
    description: "An updated page of what I'm currently working on.",
  },
};

const nowItems = {
  "Summer Plans": [
    "Continue developing this website",
    "Online CS courses/material - CS50, Fullstack Web Dev, etc.",
    "Recruiting preparation so I can get an internship in Summer 2026",
  ],
  "Side Goals": [
    "Code a working chess bot, not using stockfish or any other engine",
    "Read the books on my book list",
  ],
  "Physical Health": ["Be active all 7 days of the week", "Gym 4x + cardio 3x"],
};

export default function Now() {
  return (
    <PageLayout>
      <PageHeader
        title="Now"
        description="An updated page of what I'm currently working on."
        isHero
      />

      <SectionWrapper className="page-content">
        {Object.entries(nowItems).map(([section, items]) => (
          <section key={section} className="now-section">
            <h2 className="h2">{section}</h2>
            <ul className="now-list">
              {items.map((item, i) => (
                <li key={i} className="body-1">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </SectionWrapper>
    </PageLayout>
  );
}
