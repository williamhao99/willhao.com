/**
 * CONTENT PAGE: Placeholder Post
 *
 * Route: /blog/post1-placeholder-link
 */

import { NavigationBar, Footer, PageHeader } from "../../../components";

export const metadata = {
  title: "Placeholder Post",
  description: "A placeholder blog post.",
};

export default function Post1PlaceholderPage() {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="Placeholder Post"
            description="This is the first blog post."
            isHero={true}
          />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <p>Content for the first blog post will go here.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
