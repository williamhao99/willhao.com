import type { OsuStats } from "@/lib/data/osu";
import ledger from "@/components/ledger/Ledger.module.css";

interface OsuWidgetProps {
  data: OsuStats | null;
}

export default function OsuWidget({ data }: OsuWidgetProps) {
  let rankDisplay = "—";
  if (data && typeof data.globalRank === "number") {
    rankDisplay = "#" + data.globalRank.toLocaleString("en-US");
  }

  let peakDisplay = "—";
  if (data && typeof data.peakRank === "number") {
    peakDisplay = "#" + data.peakRank.toLocaleString("en-US");
  }

  let ppDisplay = "—";
  if (data && typeof data.pp === "number") {
    ppDisplay = data.pp.toLocaleString("en-US");
  }

  let playTimeDisplay = "—";
  if (data && typeof data.playTime === "number") {
    playTimeDisplay = data.playTime.toLocaleString("en-US") + "h";
  }

  const ariaLabel =
    "osu! stats: rank " +
    rankDisplay +
    ", peak " +
    peakDisplay +
    ", pp " +
    ppDisplay +
    ", playtime " +
    playTimeDisplay;

  return (
    <li className={ledger.row}>
      <a
        href="https://osu.ppy.sh/users/whao"
        className={ledger.when + " " + ledger.rowLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel + " (opens in new tab)"}
      >
        osu!
      </a>
      <span
        className={ledger.stats}
        aria-hidden="true"
      >
        <span>
          {rankDisplay}
          <span className={ledger.unit}>rank</span>
        </span>
        <span>
          {peakDisplay}
          <span className={ledger.unit}>peak</span>
        </span>
        <span>
          {ppDisplay}
          <span className={ledger.unit}>pp</span>
        </span>
        <span>
          {playTimeDisplay}
          <span className={ledger.unit}>played</span>
        </span>
      </span>
    </li>
  );
}
