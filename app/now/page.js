import { PageHeader, NavigationBar, Footer } from "../../components";

export const metadata = {
  title: "Now",
  description: "An updated page of what I'm currently working on.",
  openGraph: {
    title: "Will Hao - Now",
    description: "An updated page of what I'm currently working on.",
  },
};

export default function Now() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="Now"
            description="An updated page of what I'm currently working on."
            isHero={true}
          />

          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <h2 className="h2">Summer Plans</h2>
                <p className="body-1">• Continue developing this website</p>
                <p className="body-1">• Online CS courses/material - CS50, Fullstack Web Dev, etc.</p>
                <p className="body-1">• Recruiting preparation so I can get an internship in Summer 2026</p>

                <br />

                <h2 className="h2">Side Goals</h2>
                <p className="body-1">• Code a working chess bot, not using stockfish or any other engine</p>
                <p className="body-1">• Read the books on my book list</p>

                <br />

                <h2 className="h2">Physical Health</h2>
                <p className="body-1">• Be active all 7 days of the week</p>
                <p className="body-1">• Gym 4x + cardio 3x</p>

                <br />
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
