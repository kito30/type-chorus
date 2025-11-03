
export type LyricLine = {
  timeMs: number;
  text: string;
};

export type SongInfo = {
  id: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
  instrumental: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
  videoId?: string;
};

export type SongSearchResult = {
  id: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
  hasSyncedLyrics: boolean;
  hasPlainLyrics: boolean;
};

export type DifficultyPreset = {
  id: 'easy' | 'normal' | 'hard';
  spawnRateMultiplier: number;
  onScreenDurationMs: number;
  speedMultiplier: number;
};


