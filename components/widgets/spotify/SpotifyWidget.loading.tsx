import SpotifyIcon from "@/components/icons/SpotifyIcon";
import styles from "./SpotifyWidget.module.css";

export default function SpotifyWidgetLoading() {
  return (
    <div className={styles.widget}>
      <div className={styles.icon}>
        <SpotifyIcon />
      </div>
      <div className={styles.content}>
        <div className={styles.status}>Loading...</div>
        <div className={styles.title}>———</div>
        <div className={styles.artist}>———</div>
      </div>
    </div>
  );
}
