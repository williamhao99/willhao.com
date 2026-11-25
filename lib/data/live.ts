import type { SpotifyData } from "@/lib/data/spotify";
import type { ChessStats } from "@/lib/data/chess";
import type { OsuStats } from "@/lib/data/osu";

// null = nothing to show for that row yet
export interface LiveData {
  spotify: SpotifyData | null;
  chess: ChessStats | null;
  osu: OsuStats | null;
}

// Every page and route bundle gets its own copy of a module, so the data
// modules run once, in instrumentation.ts, and are shared through globalThis
const shared = globalThis as typeof globalThis & { getLive?(): LiveData };

export function shareLive(getLive: () => LiveData) {
  shared.getLive = getLive;
}

export function getCachedLive(): LiveData {
  if (shared.getLive) {
    return shared.getLive();
  }
  return { spotify: null, chess: null, osu: null };
}
