import Link from "next/link";
import {
  PageHeader,
  PageLayout,
  SectionWrapper,
  ContentLayout,
} from "../components";

export const metadata = {
  title: "Page Not Found",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <PageLayout>
      <PageHeader title="404" description="Page Not Found" isHero={true} />
      <SectionWrapper>
        <ContentLayout>
          <p className="text-center">
            The page you are looking for does not exist.
          </p>
          <div className="text-center mt-2">
            <Link href="/" className="button">
              ← Back to Home
            </Link>
          </div>
        </ContentLayout>
      </SectionWrapper>
    </PageLayout>
  );
}
