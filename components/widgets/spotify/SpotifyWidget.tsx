import type { SpotifyData } from "@/lib/data/spotify";
import ledger from "@/components/ledger/Ledger.module.css";
import styles from "./SpotifyWidget.module.css";

interface SpotifyWidgetProps {
  data: SpotifyData | null;
}

const DEFAULT_DATA: SpotifyData = {
  isPlaying: false,
  songTitle: "—",
  artist: "—",
};

export function markBackoff(prev: SpotifyData | null): SpotifyData {
  const base = prev || DEFAULT_DATA;
  if (base.backoff) {
    return base;
  }
  const next: SpotifyData = {
    isPlaying: base.isPlaying,
    songTitle: base.songTitle,
    artist: base.artist,
    backoff: true,
  };
  if (base.songUrl) {
    next.songUrl = base.songUrl;
  }
  if (base.lastPlayed) {
    next.lastPlayed = base.lastPlayed;
  }
  return next;
}

export function demoteStale(prev: SpotifyData | null): SpotifyData {
  const base = prev || DEFAULT_DATA;
  if (!base.isPlaying && base.lastPlayed !== "(paused)") {
    return markBackoff(base);
  }
  const next: SpotifyData = {
    isPlaying: false,
    songTitle: base.songTitle,
    artist: base.artist,
    backoff: true,
  };
  if (base.songUrl) {
    next.songUrl = base.songUrl;
  }
  return next;
}

export default function SpotifyWidget({ data }: SpotifyWidgetProps) {
  const shown = data || DEFAULT_DATA;
  const isPlaying = shown.isPlaying;
  const songTitle = shown.songTitle;
  const artist = shown.artist;
  const lastPlayed = shown.lastPlayed;

  let statusText = "played recently";
  if (isPlaying) {
    statusText = "playing now";
  } else if (lastPlayed === "(paused)") {
    statusText = "paused";
  } else if (lastPlayed) {
    statusText = "played " + lastPlayed;
  }
  if (shown.backoff) {
    statusText = statusText + " (retrying)";
  }

  const linked = Boolean(shown.songUrl);

  let by = null;
  let tip;
  let spoken = songTitle;
  if (artist !== "—") {
    tip = songTitle + " by " + artist;
    spoken = tip + ", " + statusText;
    let statusClass = styles.status;
    if (isPlaying && !shown.backoff) {
      statusClass = styles.status + " " + styles.playing;
    }
    by = (
      <span
        className={styles.by}
        aria-hidden={linked}
      >
        <span className={styles.artist}>{artist}</span>
        <span className={statusClass}>{statusText}</span>
      </span>
    );
  }

  // The link speaks the whole row, so the second line is hidden from it
  let title = <span className={styles.title}>{songTitle}</span>;
  if (shown.songUrl) {
    title = (
      <a
        href={shown.songUrl}
        className={styles.title + " " + styles.song}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={spoken + " (opens in new tab)"}
      >
        {songTitle}
      </a>
    );
  }

  return (
    <li className={ledger.row}>
      <a
        href="https://open.spotify.com/user/williamhao99"
        className={ledger.when}
        target="_blank"
        rel="noopener noreferrer"
      >
        Spotify
        <span className="visually-hidden"> (opens in new tab)</span>
      </a>
      <span
        className={styles.track}
        title={tip}
      >
        {title}
        {by}
      </span>
    </li>
  );
}
