import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata = {
  title: "Page Not Found",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <PageLayout>
      <PageHeader
        title="404"
        description="This page could not be found."
        isHero={false}
      />
      <SectionWrapper>
        <div className="page-content">
          <p className="text-center">
            The page you are looking for does not exist.
          </p>
          <div className="text-center mt-2">
            <Link href="/" className="button">
              ← Back to Home
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
}
