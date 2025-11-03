
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
  syncedLyrics: string;
  videoId?: string;
};

export type SongSearchResult = {
  id: number;
  trackName: string;
  artistName: string;
  albumName?: string;
  duration?: number;
  hasSyncedLyrics: boolean;
};

export type DifficultyPreset = {
  id: 'easy' | 'normal' | 'hard';
  spawnRateMultiplier: number;
  onScreenDurationMs: number;
  speedMultiplier: number;
};


