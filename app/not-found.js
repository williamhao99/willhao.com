import Link from "next/link";
import { PageHeader, NavigationBar, Footer } from "../components";

export const metadata = {
  title: "Page Not Found",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          <PageHeader title="404" description="Page Not Found" isHero={true} />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <p style={{ textAlign: "center" }}>
                  The page you are looking for does not exist.
                </p>
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <Link href="/" className="button">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
