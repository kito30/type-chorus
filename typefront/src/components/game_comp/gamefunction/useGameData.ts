import { useState, useEffect } from 'react'
import { getLyricsById } from '../../../services/lrc'
import { parseLyrics } from '../lyricsParser'
import { loadVideoId } from './loadVideoId'
import type { SongInfo } from '../../../types/music'

export function useGameData(songId: number | undefined) {
  const [record, setRecord] = useState<SongInfo | null>(null)
  const [videoId, setVideoId] = useState<string>("")
  const [lines, setLines] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!songId) return
    
    async function loadData() {
      setIsLoading(true)
      setError(null)
      
      try {
        const rec = await getLyricsById(Number(songId))
        const parsed = parseLyrics(rec)
        setRecord(rec)
        setLines(parsed)
        await loadVideoId(rec, setVideoId, setRecord)
      } catch {
        setError('Failed to load lyrics')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [songId])

  return { record, videoId, lines, isLoading, error }
}

