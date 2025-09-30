import type { Metadata } from "next";
import PdfViewer from "@/components/pdfViewer/pdfViewer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "UT Math Directed Reading Program",
  description:
    "Math research on Benford's Law and dynamical systems for the UT Math DRP.",
};

export default function UTMathDRPPage() {
  return (
    <div className={styles.content}>
      <h1>UT Math Directed Reading Program</h1>
      <h2>
        The research and math talk I conducted for the UT Math DRP Symposium on
        April 24, 2025, along with my personal takeaways.
      </h2>

      <PdfViewer
        tabs={[
          {
            label: "Presentation",
            src: "/documents/Benford's Law - From Logarithms to Dynamical Systems.pdf",
          },
        ]}
      />

      <p>
        <a
          href="https://sites.google.com/view/utmathdrp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>What is the UT Math DRP? →</strong>
        </a>
      </p>

      <p>
        {" "}
        During the start of my Spring 2025 semester at UT, I applied for the
        opportunity to work on a mathematical project of my choice with a
        graduate student mentor, Aaron Benda. I chose to research{" "}
        <u>dynamical systems</u>, and the textbook we studied was{" "}
        <em>Randomness and Recurrence in Dynamical Systems</em> by Rodney
        Nillsen.
      </p>

      <p>
        The textbook proved to be much denser* than I'd expected, and I was
        exposed to many graduate-level+ mathematical concepts. This included:
      </p>
      <ul>
        <li>Irrational number properties & applications to circle rotations</li>
        <li>Probability, in the measure theory/real analysis sense</li>
        <li>
          Randomness and average recurrence time (infinite monkeys typing
          Shakespeare problem)
        </li>
        <li>Outer measure, σ-algebra (sigma-algebra) sets</li>
        <li>Birkhoff's Ergodic Theorem</li>
      </ul>
      <p>and of course, Benford's Law.</p>

      <p>
        I met with my mentor once a week, and we'd discuss the topics in the
        textbook. I came in with notes I had taken on the textbook material
        throughout the week;
        <strong> I've attached them at the bottom of this page</strong>.
      </p>

      <p>
        This was my first ever experience at math research, so I wasn't sure
        what to expect coming in. One perspective shift was that I have a lot
        more respect for grad students now; the work they do is definitely not
        for the faint-hearted. At one point my mentor showed me his PhD
        candidacy presentation on ergodic theory, and I thought my textbook
        topics were hard to digest enough already.
      </p>

      <p>
        Overall, this program was an interesting and intellectually enriching
        experience, and I got some valuable research skills out of it,
        especially from having to prepare a technical talk using LaTeX. I do
        hope to continue doing research in the future; future areas I'm
        interested in include computer science, statistics, finance, or
        economics.
      </p>

      <p>*Real analysis joke. (ha)</p>

      <PdfViewer
        tabs={[
          { label: "Feb 17", src: "/documents/DRP notes 2-17.pdf" },
          { label: "Feb 24", src: "/documents/DRP notes 2-24.pdf" },
          { label: "Mar 03", src: "/documents/DRP notes 3-3.pdf" },
          { label: "Mar 10", src: "/documents/DRP notes 3-10.pdf" },
          { label: "Mar 24", src: "/documents/DRP notes 3-24.pdf" },
          { label: "Apr 07", src: "/documents/DRP notes 4-7.pdf" },
        ]}
      />
    </div>
  );
}
