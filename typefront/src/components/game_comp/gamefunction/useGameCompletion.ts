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

  return { saveRecentSong }
}

