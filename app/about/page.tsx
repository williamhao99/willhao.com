import { Suspense } from "react";
import AutoRefreshWidget from "@/app/about/AutoRefresh";
import SpotifyWidget from "@/components/widgets/spotify/SpotifyWidget";
import SpotifyWidgetLoading from "@/components/widgets/spotify/SpotifyWidget.loading";
import ChessWidget from "@/components/widgets/chess/ChessWidget";
import ChessWidgetLoading from "@/components/widgets/chess/ChessWidget.loading";
import { fetchSpotifyData } from "@/lib/data/spotify";
import { fetchChessStats } from "@/lib/data/chess";
import styles from "./page.module.css";

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
        Hi! My name is William Hao (I go by Will), and I'm a sophomore at UT
        Austin double majoring in Computer Science and Mathematics.
      </p>
      <p>
        I've always enjoyed math and solving puzzles since I was a kid, so much
        of what I do today relates to that in some way.
        <br /> Before college, I spent time competing in math and programming
        contests, swimming for my high school's varsity team, and{" "}
        <a
          href="https://www.simplychess.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>managing a chess organization</strong>
        </a>
        .
      </p>
      <p>
        At UT, I spend most of my time on CS- and math-related activities, from
        coding projects to hackathons, and I've also developed a strong interest
        in financial markets and algorithmic trading.
      </p>
      <p>
        Outside of academics, I enjoy playing and studying chess, working out,
        playing video games, reading, and watching movies and TV shows.
        <br />
        Fun fact: I average sub-20 on Rubik's cubes.
      </p>

      <br />

      <h2>What I'm busy with</h2>
      <ul>
        <li>Recruiting</li>
        <li>School coursework</li>
        <li>Hackathons</li>
        <li>
          Building a Kalshi trading bot - politics, economics, mentions, weather
          markets
        </li>
        <li>Improving this portfolio</li>
        <li>A 1000lb powerlifting total</li>
        <li>A sub-2hr half marathon</li>
        <li>Working through my reading list</li>
      </ul>

      <br />

      <h2>Real-time widgets</h2>
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
