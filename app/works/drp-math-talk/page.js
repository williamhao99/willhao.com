/**
 * CONTENT PAGE: UT Math Directed Reading Program Presentation
 *
 * Route: /works/drp-math-talk
 */

import {
  PageHeader,
  PageLayout,
  SectionWrapper,
  ContentLayout,
} from "../../../components";

export const metadata = {
  title: "UT Math Directed Reading Program Presentation",
  description:
    "The math talk and presentation I gave for the UT Math DRP Symposium on April 24, 2025, along with my personal experiences and takeaways.",
};

export default function DrpMathTalkPage() {
  return (
    <PageLayout includePdfViewer={true}>
      <PageHeader
        title="UT Math Directed Reading Program Presentation"
        description="The math talk and presentation I gave for the UT Math DRP Symposium on April 24, 2025, along with my personal experiences and takeaways."
        isHero={true}
      />
      <SectionWrapper>
        <ContentLayout>
          {/* Downloadable PDF Links */}
          <div style={{ marginBottom: "2rem" }}>
            <p className="body-1">
              <a
                href="/documents/Benford's Law - From Logarithms to Dynamical Systems, pauses.pdf"
                download
              >
                <strong>
                  Download: Benford's Law Presentation (with pauses)
                </strong>
              </a>
            </p>
            <p className="body-1">
              <a
                href="/documents/Benford's Law - From Logarithms to Dynamical Systems.pdf"
                download
              >
                <strong>
                  Download: Benford's Law Presentation (without pauses)
                </strong>
              </a>
            </p>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="pdf-embed" style={{ marginBottom: "2rem" }}>
            <iframe
              src="/documents/Benford's Law - From Logarithms to Dynamical Systems.pdf"
              style={{ width: "100%", height: "500px", border: "none" }}
              loading="lazy"
            ></iframe>
          </div>

          <p className="body-1">
            <a
              href="https://web.ma.utexas.edu/users/drp/about.html?ref=will-hao.ghost.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>What is the UT Math DRP? →</strong>
            </a>
          </p>

          <p className="body-1">
            During the start of my Spring 2025 semester at UT, I applied for the
            opportunity to work on a mathematical project of my choice with a
            graduate student mentor, Aaron Benda. I chose to research{" "}
            <u>dynamical systems</u>, and the textbook we studied was{" "}
            <em>Randomness and Recurrence in Dynamical Systems</em> by Rodney
            Nillsen.
          </p>

          <p className="body-1">
            The textbook proved to be much denser* than I'd expected, and I was
            exposed to many graduate-level+ mathematical concepts. This
            included:
          </p>

          <ul style={{ marginLeft: "2rem", marginBottom: "2rem" }}>
            <li className="body-1">
              Irrational number properties & applications to circle rotations
            </li>
            <li className="body-1">
              Probability, in the measure theory/real analysis sense
            </li>
            <li className="body-1">
              Randomness and average recurrence times (think infinite monkeys
              typing Shakespeare)
            </li>
            <li className="body-1">
              Outer measure, σ-algebra (sigma-algebra) sets
            </li>
            <li className="body-1">Birkhoff's Ergodic Theorem</li>
          </ul>

          <p className="body-1">and of course, Benford's Law.</p>

          <p className="body-1">
            I met with my mentor once a week, and we'd discuss the topics in the
            textbook. Usually I came in with notes I had taken on my iPad
            throughout the week;{" "}
            <strong>I've attached them at the bottom of this page</strong>.
          </p>

          <p className="body-1">
            This was my first ever experience at math research, so I wasn't sure
            what to expect coming in. One perspective shift was that I have a
            lot more respect for grad students now; the work they do is
            definitely not for the faint-hearted. At one point my mentor showed
            me his PhD candidacy presentation on ergodic theory, and I thought
            my textbook topics were hard to digest enough already.
          </p>

          <p className="body-1">
            Overall, this program was an interesting and intellectually
            enriching experience, and I got some valuable research skills out of
            it, especially from having to prepare a technical talk using LaTeX.
            I do hope to continue doing research in the future, in some form or
            fashion. Future areas I'd like to research include computer science,
            statistics, finance, or even economic theory.
          </p>

          <p className="body-1">*Real analysis joke. (ha)</p>

          <div className="content-separator"></div>

          {/* DRP notes picker */}
          <section className="pdf-picker">
            <button
              className="pdf-picker-btn"
              data-pdf="/documents/DRP notes 2-17.pdf"
            >
              DRP notes&nbsp;2-17
            </button>

            <button
              className="pdf-picker-btn"
              data-pdf="/documents/DRP notes 2-24.pdf"
            >
              DRP notes&nbsp;2-24
            </button>

            <button
              className="pdf-picker-btn"
              data-pdf="/documents/DRP notes 3-3.pdf"
            >
              DRP notes&nbsp;3-3
            </button>

            <button
              className="pdf-picker-btn"
              data-pdf="/documents/DRP notes 3-10.pdf"
            >
              DRP notes&nbsp;3-10
            </button>

            <button
              className="pdf-picker-btn"
              data-pdf="/documents/DRP notes 3-24.pdf"
            >
              DRP notes&nbsp;3-24
            </button>

            <button
              className="pdf-picker-btn"
              data-pdf="/documents/DRP notes 4-7.pdf"
            >
              DRP notes&nbsp;4-7
            </button>
          </section>
        </ContentLayout>
      </SectionWrapper>
    </PageLayout>
  );
}
