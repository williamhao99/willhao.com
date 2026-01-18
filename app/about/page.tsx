import type { Metadata } from "next";
import { Suspense } from "react";
import AutoRefreshWidget from "@/app/about/AutoRefresh";
import SpotifyWidget from "@/components/widgets/spotify/SpotifyWidget";
import SpotifyWidgetLoading from "@/components/widgets/spotify/SpotifyWidget.loading";
import ChessWidget from "@/components/widgets/chess/ChessWidget";
import ChessWidgetLoading from "@/components/widgets/chess/ChessWidget.loading";
import { fetchSpotifyData } from "@/lib/data/spotify";
import { fetchChessStats } from "@/lib/data/chess";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "CS and Math student at UT Austin. Interested in full-stack development and algorithmic trading.",
  alternates: {
    canonical: "https://willhao.com/about",
  },
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function SpotifyDataLoader() {
  try {
    const data = await fetchSpotifyData();
    return <SpotifyWidget initialData={data} />;
  } catch {
    const errorData = {
      isPlaying: false,
      songTitle: "Unable to fetch data",
      artist: "—",
    };
    return (
      <SpotifyWidget
        initialData={errorData}
        error={true}
      />
    );
  }
}

async function ChessDataLoader() {
  try {
    const data = await fetchChessStats();
    return <ChessWidget initialData={data} />;
  } catch {
    const errorData = {
      rapid: null,
      blitz: null,
      bullet: null,
    };
    return (
      <ChessWidget
        initialData={errorData}
        error={true}
      />
    );
  }
}

export default function AboutPage() {
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

      <br />

      <div className={styles.widgets}>
        <Suspense fallback={<SpotifyWidgetLoading />}>
          <SpotifyDataLoader />
        </Suspense>
        <Suspense fallback={<ChessWidgetLoading />}>
          <ChessDataLoader />
        </Suspense>
      </div>

      <AutoRefreshWidget seconds={5} />
    </>
  );
}
