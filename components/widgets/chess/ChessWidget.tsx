import type { ChessStats } from "@/lib/data/chess";
import ledger from "@/components/ledger/Ledger.module.css";

interface ChessWidgetProps {
  data: ChessStats | null;
}

export default function ChessWidget({ data }: ChessWidgetProps) {
  let rapidRating: string | number = "—";
  if (data && typeof data.rapid === "number") {
    rapidRating = data.rapid;
  }

  let blitzRating: string | number = "—";
  if (data && typeof data.blitz === "number") {
    blitzRating = data.blitz;
  }

  let bulletRating: string | number = "—";
  if (data && typeof data.bullet === "number") {
    bulletRating = data.bullet;
  }

  // No USCF API - update by hand
  const uscfRating = 1815;

  const ariaLabel =
    "Chess.com ratings: rapid " +
    rapidRating +
    ", blitz " +
    blitzRating +
    ", bullet " +
    bulletRating +
    ", USCF " +
    uscfRating;

  return (
    <li className={ledger.row}>
      <a
        href="https://www.chess.com/member/javablob"
        className={ledger.when + " " + ledger.rowLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel + " (opens in new tab)"}
      >
        Chess
      </a>
      <span
        className={ledger.stats}
        aria-hidden="true"
      >
        <span>
          {rapidRating} <span className={ledger.unit}>rapid</span>
        </span>
        <span>
          {blitzRating} <span className={ledger.unit}>blitz</span>
        </span>
        <span>
          {bulletRating} <span className={ledger.unit}>bullet</span>
        </span>
        <span>
          {uscfRating} <span className={ledger.unit}>USCF</span>
        </span>
      </span>
    </li>
  );
}
