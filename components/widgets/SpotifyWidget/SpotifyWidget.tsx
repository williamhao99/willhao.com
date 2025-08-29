import SpotifyIcon from "@/components/icons/SpotifyIcon";
import styles from "./SpotifyWidget.module.css";

export default function SpotifyWidget() {
  const isPlaying = false;
  const songTitle = "Track Name";
  const artist = "Artist Name";
  return (
    <a
      href="https://open.spotify.com/user/williamhao99?si=68fe50e5f8814bf6"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.widget}>
        <div className={styles.icon}>
          <SpotifyIcon />
        </div>
        <div className={styles.content}>
          <span className={styles.status}>
            {isPlaying ? "Now playing" : "Not playing"}
          </span>
          <h3 className={styles.title}>{songTitle}</h3>
          <p className={styles.artist}>{artist}</p>
        </div>
      </div>
    </a>
  );
}
