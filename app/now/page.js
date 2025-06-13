import { PageHeader, NavigationBar, Footer } from "../../components";

export const metadata = {
  title: "Now",
  description: "An updated page of what I'm currently working on.",
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
                <h2 className="h2">Currently Working On</h2>
                <p className="body-1">•</p>

                <br />

                <h2 className="h2">Learning & Reading</h2>
                <p className="body-1">•</p>

                <br />

                <h2 className="h2">Location & Lifestyle</h2>
                <p className="body-1">•</p>

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
