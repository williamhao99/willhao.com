import ChessIcon from "@/components/icons/ChessIcon";
import styles from "./ChessWidget.module.css";

export default function ChessWidget() {
  const rapidRating = 1500;
  const blitzRating = 1500;
  const bulletRating = 1500;
  const uscfRating = 1500;
  return (
    <a
      href="https://www.chess.com/member/javablob"
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.widget}>
        <div className={styles.icon}>
          <ChessIcon />
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            <span className={styles.label}>RAPID</span>
            <span className={styles.value}>{rapidRating}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>BLITZ</span>
            <span className={styles.value}>{blitzRating}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>BULLET</span>
            <span className={styles.value}>{bulletRating}</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>USCF</span>
            <span className={styles.value}>{uscfRating}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
