interface GameRecord {
  id: number
  trackName: string
  artistName: string
  albumName?: string
}

export function useGameCompletion() {
  const saveRecentSong = (record: GameRecord) => {
    const songInfo = {
      id: record.id,
      trackName: record.trackName,
      artistName: record.artistName,
      albumName: record.albumName,
      playedAt: Date.now(),
    }
    localStorage.setItem('profile.recentSong', JSON.stringify(songInfo))
  }

  const saveScore = (record: GameRecord, score: number) => {
    try {
      const key = 'profile.scores'
      const raw = localStorage.getItem(key)
      const list: Array<{ id: number; trackName: string; artistName: string; albumName?: string; score: number; playedAt: number }>
        = raw ? JSON.parse(raw) : []
      const entry = {
        id: record.id,
        trackName: record.trackName,
        artistName: record.artistName,
        albumName: record.albumName,
        score,
        playedAt: Date.now(),
      }
      const next = [...list, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // ignore storage errors
    }
  }

  return { saveRecentSong, saveScore }
}

