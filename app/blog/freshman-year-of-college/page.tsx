import type { Metadata } from "next";
import Image from "next/image";
import PDFViewer from "@/components/pdfViewer/pdfViewer";
import styles from "@/app/blog/BlogPost.module.css";

export const metadata: Metadata = {
  title: "Freshman year of college",
  description:
    "A reflection and recap of my freshman year at UT Austin (Fall 2024 & Spring 2025).",
  alternates: {
    canonical: "https://willhao.com/blog/freshman-year-of-college",
  },
};

export default function FreshmanYearPage() {
  return (
    <article className={styles.content}>
      <h1>Freshman year of college</h1>
      <h2>
        A reflection and recap of my freshman year (Fall 2024 & Spring 2025).
      </h2>
      <time>May 12, 2025</time>

      <figure className={styles.figure}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/kites_freshman-year.jpg"
            alt="Austin ABC Zilker Kite Festival"
            width={800}
            height={600}
            className={styles.image}
            priority={false}
          />
        </div>
        <figcaption className={styles.figcaption}>
          Austin's annual ABC Zilker Kite Festival that I went to on April 5th,
          2025
        </figcaption>
      </figure>

      <h2>1st semester (Fall 2024)</h2>

      <h3>Courses</h3>
      <p>
        I only took 14 credit hours (4 classes + some mandatory seminars), to
        experiment with my time management/moving into college and whatnot. 2 of
        these were M325K: Discrete Math, and ARC308: Architecture and Society.
        The other 2 were required classes for Plan II that proved to be more
        eye-opening than expected:
      </p>
      <ul>
        <li>E303C: World Literature</li>
        <li>TC302: Art, Sport, and the Meaning of Life</li>
      </ul>
      <p>
        These Plan II classes were very different compared to my normal STEM
        classes. The reading and writing workload amounted to about 15 hours a
        week, which kept me pretty busy. In E303C, we read some foundational
        texts of world literature, including the Rig Veda, Theogony, The Qur'an,
        and more. The focus was on how gods and demons have been represented in
        literary texts throughout history. In TC302, we explored the value of
        art and sport in human history, and analyzed them from the broader
        perspective of how humans should live their lives. I spent a lot of time
        writing the final essay for this class, which earned me an A:
      </p>

      <PDFViewer
        tabs={[
          {
            label: "ASML Paper 3 Final",
            src: "/documents/William Hao - ASML Paper 3 Final.pdf",
          },
        ]}
      />

      <h3>Extracurriculars</h3>
      <p>
        I got involved in UT's Chess Club from the start. They would meet on
        Monday evenings inside the Dobie Mall food court, set up some boards,
        and play chess for a few hours. I met lots of cool people and soon found
        myself playing on the B team for the Collegiate Chess League (CCL), an
        online competition where we could compete against other colleges' teams
        every week.
      </p>

      <figure className={styles.figure}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/b-team-lounge_freshman-year.jpg"
            alt="B Team at UT eSports Lounge"
            width={800}
            height={600}
            className={styles.image}
          />
        </div>
        <figcaption className={styles.figcaption}>
          B Team (me on the far right), after playing a match in the UT eSports
          Lounge
        </figcaption>
      </figure>

      <p>
        I explored many other campus clubs as well, going to various org fairs,
        general meetings, coffee chats, and just generally putting myself out
        there as much as possible. Admittedly, this semester I slacked on the
        quality of my club applications; next semester I had better success.
      </p>

      <h3>Personal Health & Fitness</h3>
      <p>
        One of the things I'm most proud about this semester was my progress in
        the gym and my physique.{" "}
        <em>
          (Note: By this point, I had already been working out for over a year
          now, so this is not a guide for starting the gym.)
        </em>
      </p>
      <p>
        I started in August right after a summer cut, where I committed to a
        serious bulk for the first time ever in my life, diligently tracked
        every single one of my workouts using the Hevy app, and made sure to
        push myself as hard as I could with progressive overload.
      </p>
      <p>
        Looking back, I probably spent a little too much time. I was working out
        on average 5 days a week, ~1.5 hours a day, from September through early
        December (when finals season began).
      </p>
      <p>
        But by the end of the semester, I had successfully reached my goal
        weight. My bench press increased quite significantly from 170 to 200lbs,
        and my squat went from 150 to 210lbs (I've always been a squat
        skipper... any tips appreciated). Overall, a very successful semester of
        gains.
      </p>

      <p>
        Those were probably my most memorable experiences for that semester, but
        I'm likely forgetting a few. Anyhow, I had a 1-month winter break after
        that, where I went to China and Japan.
      </p>

      <h2>2nd semester (Spring 2025)</h2>

      <h3>Courses</h3>
      <p>
        My courseload this semester was definitely more rigorous than last
        semester's. I was taking 5 classes, which were M362K: Probability,
        M427J-Honors: Differential Equations, M341: Linear Algebra, CS313E:
        Software Design in Python, and E303D: the 2nd-semester of my Plan II
        World Literature class.
      </p>
      <p>
        Problem sets, for my 3 math classes alone, would take me about 12-15
        hours per week. There was also a substantial amount of required reading
        and essay writing for E303D, which I estimate took me about another 10
        hours a week. I am quite proud of the many 500-word philosophy essays I
        wrote in that class. Here are a couple of my best ones:
      </p>

      <PDFViewer
        tabs={[
          {
            label: "World Lit - Althusser Essay",
            src: "/documents/William Hao - World Lit Althusser essay.pdf",
          },
          {
            label: "World Lit - Zizek/Arendt Essay",
            src: "/documents/William Hao - World Lit Zizek_Arendt essay.pdf",
          },
        ]}
      />

      <h3>Extracurriculars</h3>
      <p>
        I became an officer for the chess club at the start of this semester,
        because of my performances in the CCL and active involvement in the club
        last semester. One cool thing I did as officer was organizing a
        club-wide Bughouse (basically 2v2 chess) tournament, which I
        unfortunately did not end up winning as I am washed.
      </p>
      <p>
        One thing I do regret was becoming less involved during the later half
        of the semester, due to time conflicts with my other club involvement,
        Texas Undergraduate Computational Finance (UCF)...
      </p>
      <p>
        During mid-late January, orgs at UT were recruiting again, as they
        typically do twice a year. I decided that I'd shoot my shot at UCF,
        which is essentially UT's quant finance club, because I thought my
        interests were pretty aligned with what people in the club specialized
        in (math, CS, chess, poker, strategy games, etc). I spent a lot of time
        in late January preparing my application to UCF, which consisted of 3
        rounds - a written assessment, trading games, and an interview.
      </p>
      <p>
        After getting in, I was spending 12-15 hours a week for UCF-related
        activities, like attending weekly meetings, Sunday lectures, writing
        market watches and stock analyses, working on pitches for quant- or
        computational-related topics, and attending org socials. Our end-of-year
        barge was especially fun.
      </p>
      <p>
        Being surrounded by upperclassmen, many of whom had offers at well-known
        companies this summer, I often felt like I did not belong in the same
        room. However, I've definitely been inspired by the work I see in this
        club - it's motivated me to study CS and finance this summer more
        in-depth. I hope that next semester I can contribute even more, by being
        more knowledgeable as a whole. Overall I am relatively satisfied with
        the work I did; one of the 10 market watches I wrote this semester is
        attached below.
      </p>

      <PDFViewer
        tabs={[
          {
            label: "2025-03-13 UCF Market Watch",
            src: "/documents/2025-03-13 UCF Thursday Evening Market Watch.pdf",
          },
        ]}
      />

      <h3>Personal Health & Fitness</h3>
      <p>
        I tried out for UT's Table Tennis team at the start of the semester,
        having played lots of table tennis as a kid and getting a brand-new
        paddle from my trip in China. I made it onto the B Team, but regrettably
        ended up not going to any tournaments with the team due to UCF-related
        time commitments.
      </p>
      <p>
        In the gym, I was definitely less consistent this semester, mostly due
        to having a lot less free time. My bench only increased from 200 to
        210lbs, and my squat stayed relatively similar (never tried testing my
        1-rep max this semester). I'm aiming to get back into my old workout
        habits during this summer, as I'll have a lot more free time. A 225lb
        bench @ &lt;155lb bodyweight is my goal before school starts in the
        Fall. I also want to start swimming and running again, both this summer
        and next year.
      </p>

      <h2>Final Thoughts</h2>
      <p>
        All in all I'd say I had a successful first-year. I could have been more
        productive at times, but I achieved most of the goals I set out for
        myself at the beginning - having a 4.0 GPA, being consistent in the gym
        for my physical health, joining a preprofessional org, and making some
        good friends.
      </p>
      <p>
        Next year, I want to allocate more time to reading books and working on
        personal side projects. It will be a grind though, as I'll be focused on
        summer internship recruiting, on top of having to balance everything
        else. In fact, that pretty much sums up my goals for sophomore year:
        achieve everything I did freshman year, plus reading more books, working
        on side projects, and job recruiting. To do that, I'll have to somehow
        squeeze out ~2-3 hours more every day, which means less doomscrolling
        😦.
      </p>
    </article>
  );
}
