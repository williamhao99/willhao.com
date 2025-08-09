import { PageLayout } from "@/components";
import { SpotifyWidget, ChessWidget, ClashWidget } from "@/components/widgets";

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
