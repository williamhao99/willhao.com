import ChessIcon from "@/components/icons/ChessIcon";
import styles from "./ChessWidget.module.css";

export default function ChessWidgetLoading() {
  return (
    <div className={styles.widget}>
      <div className={styles.icon}>
        <ChessIcon />
      </div>
      <div className={styles.content}>
        <div className={styles.item}>
          <div className={styles.label}>RAPID</div>
          <div className={styles.value}>———</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>BLITZ</div>
          <div className={styles.value}>———</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>BULLET</div>
          <div className={styles.value}>———</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>USCF</div>
          <div className={styles.value}>1815</div>
        </div>
      </div>
    </div>
  );
}
