import type { Metadata } from "next";
import SpotifyWidget from "@/components/widgets/spotify/SpotifyWidget";
import ChessWidget from "@/components/widgets/chess/ChessWidget";
import OsuWidget from "@/components/widgets/osu/OsuWidget";
import { getCachedSpotifyData } from "@/lib/data/spotify";
import { getCachedChessStats } from "@/lib/data/chess";
import { getCachedOsuStats } from "@/lib/data/osu";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "CS and Math student at UT Austin. Interested in full-stack development and algorithmic trading.",
  alternates: {
    canonical: "https://willhao.com/about",
  },
  openGraph: {
    title: "About",
    description:
      "CS and Math student at UT Austin. Interested in full-stack development and algorithmic trading.",
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
        This has led me to interests in full-stack development and algorithmic
        trading during my time in college.
        <br />
        Currently, I'm working on developing systematic strategies for
        prediction markets.
      </p>
      <p>
        Outside of school, I like to lift and run - I'm training for a 1000lb
        powerlifting total and a half marathon.
        <br />I also play chess regularly, and average sub-20 on Rubik's cubes.
      </p>

      <div className={styles.widgets}>
        <SpotifyWidget initialData={spotifyData} />
        <ChessWidget initialData={chessData} />
        <OsuWidget initialData={osuData} />
      </div>
    </>
  );
}
