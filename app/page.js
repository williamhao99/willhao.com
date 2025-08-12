import PageLayout from "@/components/PageLayout";
import SpotifyWidget from "@/components/widgets/SpotifyWidget";
import ChessWidget from "@/components/widgets/ChessWidget";
import ClashWidget from "@/components/widgets/ClashWidget";

export const metadata = {
  title: "Home",
  description:
    "This site is my portfolio containing my work, blog, projects, and more.",
  openGraph: {
    title: "Will Hao - Portfolio",
    description:
      "This site is my portfolio containing my work, blog, projects, and more.",
  },
};

export default function Home() {
  return (
    <PageLayout>
      <section className="container medium section-hero hero-content">
        <h1 className="h1 hero-title">I'm Will Hao — welcome to my website!</h1>
        <p className="body-1 hero-desc">
          This site is my portfolio containing my work, blog, projects, and
          more.
        </p>
        <div className="hero-widgets">
          <SpotifyWidget />
          <ChessWidget />
          <ClashWidget />
        </div>
      </section>
    </PageLayout>
  );
}
