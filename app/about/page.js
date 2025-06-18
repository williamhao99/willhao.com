import { PageHeader, NavigationBar, Footer } from "../../components";

export const metadata = {
  title: "About",
  description: "Learn more about Will Hao",
  openGraph: {
    title: "Will Hao - About",
    description: "Learn more about Will Hao",
  },
};

export default function About() {
  return (
    <div className="site">
      <NavigationBar />

      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="About"
            description="Last updated: May 12, 2025"
            isHero={true}
          />

          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                <p className="body-1">
                  Hi! My name is William Hao (I go by Will), and I am currently
                  a rising sophomore at UT Austin double majoring in Mathematics
                  and Plan II Honors.
                </p>

                <p className="body-1">
                  I've always liked doing math and solving puzzles since I was a
                  kid, so most of what I do today relates to that in some way.
                  In middle and high school, my biggest time commitments were
                  competitive math and programming contests, varsity swim, and
                  managing a chess organization (
                  <a
                    href="https://www.simplychess.net"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>you can find it here</strong>
                  </a>
                  ).
                </p>

                <p className="body-1">
                  In college, I've dedicated most of my time towards studying
                  math, learning more about financial markets or trading, coding
                  projects, and staying physically active.
                </p>

                <p className="body-1">
                  Outside of school and academics, I'm usually playing and
                  studying chess, or working out (
                  <a href="/blog/personal-health-and-fitness">
                    <strong>see my fitness blog for more details</strong>
                  </a>
                  ).
                </p>

                <p className="body-1">
                  Random fun fact: I can solve a Rubik's cube in under 20
                  seconds
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
