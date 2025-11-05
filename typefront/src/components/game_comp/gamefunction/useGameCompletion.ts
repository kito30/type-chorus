import { useAuth } from '../../../contexts/AuthContextType'
interface GameRecord {
  id: number
  trackName: string
  artistName: string
  albumName?: string
}

export function useGameCompletion() {
  const { user } = useAuth()
  const userId = user?.id || 'anon'
  const saveRecentSong = (record: GameRecord) => {
    const songInfo = {
      id: record.id,
      trackName: record.trackName,
      artistName: record.artistName,
      albumName: record.albumName,
      playedAt: Date.now(),
    }
    const key = `profile.recentSong.${userId}`
    localStorage.setItem(key, JSON.stringify(songInfo))
  }

  const saveScore = (record: GameRecord, score: number) => {
    try {
      const key = `profile.scores.${userId}`
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

