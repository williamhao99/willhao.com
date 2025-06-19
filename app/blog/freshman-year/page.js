/**
 * CONTENT PAGE: Freshman Year of College
 *
 * Route: /blog/freshman-year
 */

import { NavigationBar, Footer, PageHeader } from "../../../components";
import PdfViewer from "../../../components/PdfViewer";

export const metadata = {
  title: "Freshman year of college",
  description:
    "A reflection and recap of my freshman year (Fall 2024 & Spring 2025).",
};

export default function FreshmanYearPage() {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">
          <PageHeader
            title="Freshman year of college"
            description="A reflection and recap of my freshman year (Fall 2024 & Spring 2025)."
            isHero={true}
          />
          <section className="section-wrap">
            <div className="container medium">
              <div className="page-content">
                {/* Kite Festival Image */}
                <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                  <img
                    src="/images/kites_freshman-year.jpg"
                    alt="Austin ABC Zilker Kite Festival"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  />
                  <div
                    style={{
                      padding: "0.5rem",
                      fontSize: "1.6rem",
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    Austin's annual ABC Zilker Kite Festival that I went to on
                    April 5th, 2025
                  </div>
                </div>

                {/* Separator */}
                <div className="content-separator"></div>

                <h2 className="h2">1st semester (Fall 2024)</h2>

                <h3 className="h3">Courses</h3>
                <p className="body-1">
                  I only took 14 credit hours (4 classes + some mandatory
                  seminars), to experiment with my time management/moving into
                  college and whatnot. 2 of these were M325K: Discrete Math, and
                  ARC308: Architecture and Society. The other 2 were required
                  classes for Plan II that proved to be more eye-opening than
                  expected:
                </p>
                <ul style={{ marginLeft: "2rem", marginBottom: "2rem" }}>
                  <li className="body-1">E303C: World Literature</li>
                  <li className="body-1">
                    TC302: Art, Sport, and the Meaning of Life
                  </li>
                </ul>
                <p className="body-1">
                  These Plan II classes were very different compared to my
                  normal STEM classes. The reading and writing workload amounted
                  to about 15 hours a week, which kept me pretty busy. In E303C,
                  we read some foundational texts of world literature, including
                  the Rig Veda, Theogony, The Qur'an, and more. The focus was on
                  how gods and demons have been represented in literary texts
                  throughout history. In TC302, we explored the value of art and
                  sport in human history, and analyzed them from the broader
                  perspective of how humans should live their lives. I spent a
                  lot of time writing the final essay for this class, which
                  earned me an A:
                </p>
                <section className="pdf-picker">
                  <button
                    className="pdf-picker-btn"
                    data-pdf="/documents/William Hao - ASML Paper 3 Final.pdf"
                  >
                    ASML Paper 3 Final
                  </button>
                </section>

                <h3 className="h3">Extracurriculars</h3>
                <p className="body-1">
                  I got involved in UT's Chess Club from the start. They would
                  meet on Monday evenings inside the Dobie Mall food court, set
                  up some boards, and play chess for a few hours. I met lots of
                  cool people and soon found myself playing on the B team for
                  the Collegiate Chess League (CCL), an online competition where
                  we could compete against other colleges' teams every week.
                </p>

                {/* B Team eSports Lounge Image */}
                <div style={{ margin: "2rem 0", textAlign: "center" }}>
                  <img
                    src="/images/b-team-lounge_freshman-year.jpg"
                    alt="B Team at UT eSports Lounge"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  />
                  <div
                    style={{
                      padding: "0.5rem",
                      fontSize: "1.6rem",
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    B Team (me on the far right), after playing a match in the
                    UT eSports Lounge
                  </div>
                </div>

                <p className="body-1">
                  I explored many other campus clubs as well, going to various
                  org fairs, general meetings, coffee chats, and just generally
                  putting myself out there as much as possible. Admittedly, this
                  semester I slacked on the quality of my club applications;
                  next semester I had better success.
                </p>

                <h3 className="h3">Personal Health & Fitness</h3>
                <p className="body-1">
                  One of the things I'm most proud about this semester was my
                  progress in the gym and my physique.{" "}
                  <em>
                    (Note: By this point, I had already been working out for
                    over a year now, so this is not a guide for starting the
                    gym.)
                  </em>
                </p>
                <p className="body-1">
                  I started in August right after a summer cut, where I weighed
                  about 140 lbs @ ~12% body fat. I committed to a serious bulk
                  for the first time ever in my life, diligently tracked every
                  single one of my workouts using the Hevy app, and made sure to
                  push myself as hard as I could with progressive overload.
                </p>
                <p className="body-1">
                  Looking back, I probably spent a little too much time. I was
                  working out on average 5 days a week, ~1.5 hours a day, from
                  September through early December (when finals season began).
                </p>
                <p className="body-1">
                  But by the end of the semester, I had successfully gained 15
                  pounds on my bulk, putting me at 155 lbs - almost exactly my
                  goal weight. My bench press increased quite significantly from
                  170 to 200lbs, and my squat went from 150 to 210lbs (I've
                  always been a squat skipper 😔... any tips appreciated).
                  Overall, a very successful semester of gains.
                </p>

                {/* Separator */}
                <div className="content-separator"></div>

                <p className="body-1">
                  Those were probably my most memorable experiences for that
                  semester, but I'm likely forgetting a few. Anyhow, I had a
                  1-month winter break after that. See my{" "}
                  <a href="/blog/winter-break-asia-trip">
                    <strong>post about my trip to Asia</strong>
                  </a>{" "}
                  for more details.
                </p>

                {/* Separator */}
                <div className="content-separator"></div>

                <h2 className="h2">2nd semester (Spring 2025)</h2>

                <h3 className="h3">Courses</h3>
                <p className="body-1">
                  My courseload this semester was definitely more rigorous than
                  last semester's. I was taking 5 classes, which were M362K:
                  Probability, M427J-Honors: Differential Equations, M341:
                  Linear Algebra, CS313E: Software Design in Python, and E303D:
                  the 2nd-semester of my Plan II World Literature class.
                </p>
                <p className="body-1">
                  Problem sets, for my 3 math classes alone, would take me about
                  12-15 hours per week. There was also a substantial amount of
                  required reading and essay writing for E303D, which I estimate
                  took me about another 10 hours a week. I am quite proud of the
                  many 500-word philosophy essays I wrote in that class. Here
                  are a couple of my best ones:
                </p>
                <section className="pdf-picker">
                  <button
                    className="pdf-picker-btn"
                    data-pdf="/documents/William Hao - World Lit Althusser essay.pdf"
                  >
                    World Lit - Althusser Essay
                  </button>

                  <button
                    className="pdf-picker-btn"
                    data-pdf="/documents/William Hao - World Lit Zizek_Arendt essay.pdf"
                  >
                    World Lit - Zizek/Arendt Essay
                  </button>
                </section>

                <h3 className="h3">Extracurriculars</h3>
                <p className="body-1">
                  I became an officer for the chess club at the start of this
                  semester, because of my performances in the CCL and active
                  involvement in the club last semester. One cool thing I did as
                  officer was organizing a club-wide Bughouse (basically 2v2
                  chess) tournament, which I unfortunately did not end up
                  winning as I am washed.
                </p>
                <p className="body-1">
                  One thing I do regret was becoming less involved during the
                  later half of the semester, due to time conflicts with my
                  other club involvement, Texas Undergraduate Computational
                  Finance (UCF)...
                </p>
                <p className="body-1">
                  During mid-late January, orgs at UT were recruiting again, as
                  they typically do twice a year. I decided that I'd shoot my
                  shot at UCF, which is essentially UT's quant finance club,
                  because I thought my interests were pretty aligned with what
                  people in the club specialized in (math, CS, chess, poker,
                  strategy games, etc). I spent a lot of time in late January
                  preparing my application to UCF, which consisted of 3 rounds -
                  a written assessment, trading games, and an interview.
                </p>
                <p className="body-1">
                  After getting in, I was spending 12-15 hours a week for
                  UCF-related activities, like attending weekly meetings, Sunday
                  lectures, writing market watches and stock analyses, working
                  on pitches for quant- or computational-related topics, and
                  attending org socials. Our end-of-year barge was especially
                  fun.
                </p>

                <p className="body-1">
                  Being surrounded by upperclassmen, many of whom had offers at
                  well-known companies this summer, I often felt like I did not
                  belong in the same room. However, I've definitely been
                  inspired by the work I see in this club - it's motivated me to
                  study CS and finance this summer more in-depth. I hope that
                  next semester I can contribute even more, by being more
                  knowledgeable as a whole. Overall I am relatively satisfied
                  with the work I did; one of the 10 market watches I wrote this
                  semester is attached below.
                </p>
                <section className="pdf-picker">
                  <button
                    className="pdf-picker-btn"
                    data-pdf="/documents/2025-02-18 UCF Tuesday Evening Market Watch.pdf"
                  >
                    2025-02-18 UCF Tuesday Evening Market Watch
                  </button>
                </section>

                <h3 className="h3">Personal Health & Fitness</h3>
                <p className="body-1">
                  I tried out for UT's Table Tennis team at the start of the
                  semester, having played lots of table tennis as a kid and
                  getting a brand-new paddle from my trip in China. I made it
                  onto the B Team, but regrettably ended up not going to any
                  tournaments with the team due to UCF-related time commitments.
                </p>
                <p className="body-1">
                  In the gym, I was definitely less consistent this semester,
                  mostly due to having a lot less free time. My bench only
                  increased from 200 to 210lbs, and my squat stayed relatively
                  similar (never tried testing my 1-rep max this semester). I'm
                  aiming to get back into my old workout habits during this
                  summer, as I'll have a lot more free time. A 225lb bench @
                  &lt;155lb bodyweight is my goal before school starts in the
                  Fall. I also want to start swimming and running again, both
                  this summer and next year.
                </p>

                {/* Separator */}
                <div className="content-separator"></div>

                <h2 className="h2">Final Thoughts</h2>
                <p className="body-1">
                  All in all I'd say I had a successful first-year. I could have
                  been more productive at times, but I achieved most of the
                  goals I set out for myself at the beginning - having a 4.0
                  GPA, being consistent in the gym for my physical health,
                  joining a preprofessional org, and making some good friends
                  (and girlfriend too 😄).
                </p>
                <p className="body-1">
                  Next year, I want to allocate more time to reading books and
                  working on personal side projects. It will be a grind though,
                  as I'll be focused on summer internship recruiting, on top of
                  having to balance everything else. In fact, that pretty much
                  sums up my goals for sophomore year: achieve everything I did
                  freshman year, plus reading more books, working on side
                  projects, and job recruiting. To do that, I'll have to somehow
                  squeeze out ~2-3 hours more every day, which means less
                  doomscrolling 😦.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <PdfViewer />
    </div>
  );
}
