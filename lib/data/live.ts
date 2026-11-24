import type { SpotifyData } from "@/lib/data/spotify";
import type { ChessStats } from "@/lib/data/chess";
import type { OsuStats } from "@/lib/data/osu";

// null = nothing to show for that row yet
export interface LiveData {
  spotify: SpotifyData | null;
  chess: ChessStats | null;
  osu: OsuStats | null;
}

interface LiveSource {
  getCached(): LiveData;
  fetch(): Promise<LiveData>;
}

// Every page and route bundle gets its own copy of a module, so the data
// modules run once, in instrumentation.ts, and are shared through globalThis
const shared = globalThis as typeof globalThis & { liveSource?: LiveSource };

const EMPTY: LiveData = { spotify: null, chess: null, osu: null };

export function shareLive(source: LiveSource) {
  shared.liveSource = source;
}

export function getCachedLive(): LiveData {
  if (shared.liveSource) {
    return shared.liveSource.getCached();
  }
  return EMPTY;
}

export async function fetchLive(): Promise<LiveData> {
  if (shared.liveSource) {
    return shared.liveSource.fetch();
  }
  return EMPTY;
}
