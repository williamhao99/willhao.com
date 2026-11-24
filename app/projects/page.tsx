import type { Metadata } from "next";
import BackLink from "@/components/backLink/BackLink";
import Ledger from "@/components/ledger/Ledger";
import ProjectRows from "@/components/projectRows/ProjectRows";
import { projects } from "@/app/projects/projects";

export const metadata: Metadata = {
  title: "Projects",
  alternates: {
    canonical: "https://willhao.com/projects",
  },
  openGraph: {
    title: "Projects",
    url: "https://willhao.com/projects",
    siteName: "Will Hao",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <BackLink
        href="/"
        label="Back to home"
      />
      <h1>Projects</h1>
      <Ledger loose>
        <ProjectRows projects={projects} />
      </Ledger>
    </>
  );
}
