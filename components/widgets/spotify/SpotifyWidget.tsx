import SpotifyIcon from "@/components/icons/SpotifyIcon";
import type { SpotifyData } from "@/lib/data/spotify";
import styles from "./SpotifyWidget.module.css";

interface SpotifyWidgetProps {
  initialData: SpotifyData;
}

export default function SpotifyWidget({ initialData }: SpotifyWidgetProps) {
  const data = initialData;

  let isPlaying = data.isPlaying;
  let songTitle = data.songTitle;
  let artist = data.artist;
  let lastPlayed = data.lastPlayed;

  let statusText = "Last played";
  if (isPlaying) {
    statusText = "Now playing";
  } else if (lastPlayed) {
    statusText = "Last played " + lastPlayed;
  }

  let widgetClassName = styles.widget;
  if (isPlaying) {
    widgetClassName = styles.widget + " " + styles.playing;
  }

  return (
    <a
      href="https://open.spotify.com/user/williamhao99?si=68fe50e5f8814bf6"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={widgetClassName}>
        <div className={styles.icon}>
          <SpotifyIcon />
        </div>
        <div className={styles.content}>
          <span className={styles.status}>{statusText}</span>
          <h3 className={styles.title}>{songTitle}</h3>
          <p className={styles.artist}>{artist}</p>
        </div>
      </div>
    </a>
  );
}
