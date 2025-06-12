import { PageHeader, NavigationBar, Footer } from "../../components";

export const metadata = {
  title: "About",
  description: "Learn more about Will Hao",
};

export default function About() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="About"
            description="Last updated: "
            isHero={true}
          />

          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <p>Placeholder text</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
