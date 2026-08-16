import type { Metadata } from "next";
import SpotifyWidget from "@/components/widgets/spotify/SpotifyWidget";
import ChessWidget from "@/components/widgets/chess/ChessWidget";
import OsuWidget from "@/components/widgets/osu/OsuWidget";
import { getCachedSpotifyData } from "@/lib/data/spotify";
import { getCachedChessStats } from "@/lib/data/chess";
import { getCachedOsuStats } from "@/lib/data/osu";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "CS and Math student at UT Austin. Interested in quantitative finance, software engineering, and applied AI.",
  alternates: {
    canonical: "https://willhao.com/about",
  },
  openGraph: {
    title: "About",
    description:
      "CS and Math student at UT Austin. Interested in quantitative finance, software engineering, and applied AI.",
    url: "https://willhao.com/about",
  },
};

export default async function AboutPage() {
  const spotifyData = getCachedSpotifyData();
  const chessData = getCachedChessStats();
  const osuData = getCachedOsuStats();

  return (
    <>
      <h1>About</h1>
      <p>
        Hi! I'm Will, a student at UT Austin studying Computer Science and
        Mathematics.
      </p>
      <p>
        I've always enjoyed solving puzzles and building things, ever since I
        was a kid.
        <br />
        This has led me to interests in quantitative finance, software
        engineering, and applied AI.
      </p>
      <p>
        Outside of school, I like to lift and run - I'm training for a 1000lb
        powerlifting total and a half marathon.
        <br />I play table tennis, pickleball, and tennis when I can. I also
        like chess and video games, and average sub-20 on Rubik's cubes.
      </p>

      <div className={styles.widgets}>
        <SpotifyWidget initialData={spotifyData} />
        <ChessWidget initialData={chessData} />
        <OsuWidget initialData={osuData} />
      </div>
    </>
  );
}
