import SpotifyWidget from "@/components/widgets/SpotifyWidget/SpotifyWidget";
import ChessWidget from "@/components/widgets/ChessWidget/ChessWidget";
import AutoRefreshWidget from "@/components/widgets/AutoRefreshWidget";
import { fetchSpotifyData } from "@/lib/data/spotify";
import { fetchChessStats } from "@/lib/data/chess";
import styles from "./page.module.css";

export const revalidate = 5;

async function getSpotifyData() {
  try {
    return await fetchSpotifyData();
  } catch {
    return null;
  }
}

async function getChessData() {
  try {
    return await fetchChessStats();
  } catch {
    return { rapid: null, blitz: null, bullet: null };
  }
}

export default async function AboutPage() {
  const [spotifyData, chessData] = await Promise.all([
    getSpotifyData(),
    getChessData(),
  ]);

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

      <div className={styles.widgets}>
        <SpotifyWidget initialData={spotifyData} />
        <ChessWidget initialData={chessData} />
      </div>

      <AutoRefreshWidget seconds={5} />
    </>
  );
}
