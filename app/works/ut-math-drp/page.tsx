import type { Metadata } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import PdfViewer from "@/components/pdfViewer/pdfViewer";
import Prose from "@/components/prose/Prose";
import ViewCounter from "@/components/viewCounter/ViewCounter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Benford's Law and Ergodic Theory",
  description:
    "Undergraduate research on Benford's Law and ergodic theory through the UT Math Directed Reading Program.",
  alternates: {
    canonical: "https://willhao.com/works/ut-math-drp",
  },
  openGraph: {
    title: "Benford's Law and Ergodic Theory",
    description:
      "Undergraduate research on Benford's Law and ergodic theory through the UT Math Directed Reading Program.",
    url: "https://willhao.com/works/ut-math-drp",
  },
};

export default function UTMathDRPPage() {
  return (
    <Prose>
      <Link
        href="/works"
        className="back-link"
      >
        ← Back to Works
      </Link>
      <h1>Benford's Law and Ergodic Theory</h1>
      <h2>Why does the digit 1 lead 30% of real-world numbers?</h2>

      <div className={styles.meta}>
        <div>
          <a
            href="https://sites.google.com/view/utmathdrp"
            target="_blank"
            rel="noopener noreferrer"
          >
            UT Math DRP
          </a>{" "}
          Symposium, April 24, 2025
          <span className={styles.dot}>·</span>
          <ViewCounter slug="works-ut-math-drp" />
        </div>
      </div>

      <p className={styles.abstract}>
        <strong>Abstract:</strong> Working from Nillsen's{" "}
        <em>Randomness and Recurrence in Dynamical Systems</em>, I presented a
        proof sketch of Benford's Law using dynamical systems: leading digits
        map to mantissas via <InlineMath math="\log_{10}," /> and Weyl
        equidistribution on irrational circle rotations (Kronecker systems)
        yields the formula. I also studied recurrence (Poincaré, Kac), normal
        numbers, and ergodicity as the shared framework for
        &ldquo;random-looking&rdquo; digit behavior.
      </p>

      <PdfViewer
        tabs={[
          {
            label: "Presentation",
            src: "/documents/Benford's Law - From Logarithms to Dynamical Systems.pdf",
          },
        ]}
      />

      <h3>The Phenomenon</h3>
      <p>
        Benford's Law shows up in tax returns, stock prices, physical constants,
        population data - anywhere numbers span orders of magnitude. The leading
        digit <InlineMath math="d" /> satisfies{" "}
        <InlineMath math="P(d) = \log_{10}\left(1 + \frac{1}{d}\right)," /> so 1
        leads 30.1% of the time and 9 just 4.6%.
      </p>

      <h3>Why It Happens</h3>
      <p>
        Take <InlineMath math="2^n" />. Any real number can be written as{" "}
        <InlineMath math="10^k \cdot m" /> where{" "}
        <InlineMath math="m \in [1, 10)" /> is the mantissa - the part that
        determines the leading digit. Since{" "}
        <InlineMath math="2 = 10^{\log_{10}(2)}," /> we have{" "}
        <InlineMath math="2^n = 10^{n \log_{10}(2)}." />
      </p>
      <p>
        Write <InlineMath math="n \log_{10}(2) = k + \{n \log_{10}(2)\}" />{" "}
        where <InlineMath math="k = \lfloor n \log_{10}(2) \rfloor" /> and{" "}
        <InlineMath math="\{x\} = x - \lfloor x \rfloor" /> is the fractional
        part. Then{" "}
        <InlineMath math="2^n = 10^k \cdot 10^{\{n \log_{10}(2)\}}," />
        so <InlineMath math="m = 10^{\{n \log_{10}(2)\}}" />. The leading digit
        is <InlineMath math="d" /> iff <InlineMath math="m \in [d, d+1)," />{" "}
        i.e.{" "}
        <InlineMath math="\{n \log_{10}(2)\} \in [\log_{10}(d), \log_{10}(d+1))" />
        .
      </p>
      <p>
        This sequence of fractional parts is a{" "}
        <a
          href="https://en.wikipedia.org/wiki/Irrational_rotation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kronecker system
        </a>
        : rotation on <InlineMath math="[0,1)" /> by the irrational angle{" "}
        <InlineMath math="\log_{10}(2)" />.{" "}
        <a
          href="https://en.wikipedia.org/wiki/Equidistribution_theorem"
          target="_blank"
          rel="noopener noreferrer"
        >
          Weyl's Equidistribution Theorem
        </a>{" "}
        says such orbits are uniformly distributed. Since the orbit visits
        intervals in proportion to their length,{" "}
        <InlineMath math="P(\text{leading digit} = d) = \log_{10}(d+1) - \log_{10}(d) = \log_{10}\left(1 + \frac{1}{d}\right)," />
        which is exactly Benford's Law. The same argument extends to any
        multiplicatively growing sequence.
      </p>
      <p>
        Intuitively, going from leading digit 1 to 2 requires doubling, while 8
        to 9 is only a 12.5% increase. So, in real-world datasets,
        multiplicative processes spend more time with smaller leading digits.
      </p>

      <h3>Scale Invariance</h3>
      <p>
        Scale invariance gives a different perspective. Units are arbitrary - a
        natural leading-digit law shouldn't care whether we measure in miles or
        kilometers. Benford's Law is the unique distribution with this property.
        On a log scale, multiplying by a constant just adds a constant;
        invariance under these shifts corresponds to a uniform distribution of
        fractional parts of <InlineMath math="\log_{10}(x)," /> which produces
        Benford's formula.
      </p>

      <hr className={styles.sectionBreak} />

      <h3>Recurrence and Waiting Times</h3>
      <p>
        The Kronecker system above is one example of a dynamical system - a
        model of how states evolve over time. A natural question: how often do
        these systems revisit particular states?{" "}
        <a
          href="https://en.wikipedia.org/wiki/Poincar%C3%A9_recurrence_theorem"
          target="_blank"
          rel="noopener noreferrer"
        >
          Poincaré's recurrence theorem
        </a>
        : for a measure-preserving transformation on a finite-measure space
        (e.g., a length-preserving map on a bounded interval), almost every
        point in a set <InlineMath math="U" /> eventually returns to{" "}
        <InlineMath math="U" />. The strengthened version says almost every
        point is recurrent, returning arbitrarily close to its starting position
        infinitely often.
      </p>
      <p>
        Kac's theorem quantifies the average return time: if{" "}
        <InlineMath math="U" /> is a region within a space{" "}
        <InlineMath math="S," /> the expected number of steps to return to{" "}
        <InlineMath math="U" /> is <InlineMath math="\mu(S)/\mu(U)," /> the
        ratio of total measure to the region's measure. If{" "}
        <InlineMath math="U" /> occupies 10% of the space, you return on average
        every 10 iterations.
      </p>

      <h3>Randomness and Normal Numbers</h3>
      <p>
        Benford's Law shows that first digits aren't uniformly distributed
        across datasets. But what about all digits within a single number? When
        do those look &ldquo;random&rdquo;? A number is normal (in a given base)
        if its digits look statistically uniform at every level: single digits,
        pairs, triples, and longer blocks all occur in the proportions you'd
        expect from random digits.{" "}
        <a
          href="https://en.wikipedia.org/wiki/Normal_number"
          target="_blank"
          rel="noopener noreferrer"
        >
          Borel's Normal Numbers Theorem
        </a>
        : almost all real numbers are normal. (This is a loose definition; the
        formal treatment involves measure theory and is worth exploring if
        you're curious.)
      </p>
      <p>
        Important distinction: normality is about digit distribution within a
        single number's base-b expansion, while Benford's Law is about leading
        digits across a dataset. For example, <InlineMath math="2/3" /> is not
        normal - its expansion is eventually periodic in any integer base. In
        binary, <InlineMath math="2/3 = 0.\overline{10}_2" />: 0s and 1s appear
        equally often, but among length-2 blocks only 10 and 01 appear; 00 and
        11 never occur, where a normal number would have each pair at frequency{" "}
        <InlineMath math="1/4" />. So it looks &ldquo;normal&rdquo; for single
        digits but fails normality at length 2. Both Benford and normality ask
        &ldquo;what does randomness look like?&rdquo; in different contexts.
      </p>

      <h3>The Bigger Picture</h3>
      <p>
        These seemingly distinct results share a common foundation in ergodic
        theory. A system is ergodic if a single trajectory, followed long
        enough, visits every region in proportion to its measure.{" "}
        <a
          href="https://mathworld.wolfram.com/BirkhoffsErgodicTheorem.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Birkhoff's Ergodic Theorem
        </a>{" "}
        formalizes this: in ergodic systems, time averages equal space averages.
        Track one orbit over time, and the fraction of time it spends in any
        region converges to that region's measure.
      </p>
      <p>
        Borel's theorem, Weyl's theorem, and Benford's Law are all instances of
        this principle. The digit 1 leads 30% of the time because the
        corresponding interval on <InlineMath math="[0,1)" /> has measure{" "}
        <InlineMath math="\log_{10}(2) - \log_{10}(1) \approx 0.301" />.
      </p>

      <h3>Weekly Notes</h3>
      <PdfViewer
        tabs={[
          { label: "02/17/25", src: "/documents/DRP notes 02-17-25.pdf" },
          { label: "02/24/25", src: "/documents/DRP notes 02-24-25.pdf" },
          { label: "03/03/25", src: "/documents/DRP notes 03-03-25.pdf" },
          { label: "03/10/25", src: "/documents/DRP notes 03-10-25.pdf" },
          { label: "03/24/25", src: "/documents/DRP notes 03-24-25.pdf" },
          { label: "04/07/25", src: "/documents/DRP notes 04-07-25.pdf" },
        ]}
      />
    </Prose>
  );
}
