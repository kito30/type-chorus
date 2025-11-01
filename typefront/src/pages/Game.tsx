import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLyricsById } from '../services/lrc'
import type { LyricsRecord } from '../types/music'
import GameHeader from '../components/game_comp/GameHeader'
import GameTitle from '../components/game_comp/GameTitle'
import LyricsDisplay from '../components/game_comp/LyricsDisplay'
import GameInput from '../components/game_comp/GameInput'
import GameControls from '../components/game_comp/GameControls'
import { parseLyrics } from '../components/game_comp/lyricsParser'

type Phase = 'idle' | 'countdown' | 'playing' | 'finished'

export default function Game() {
  const { id } = useParams()
  const [record, setRecord] = useState<LyricsRecord | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [lines, setLines] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const visibleCount = 3
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    getLyricsById(Number(id))
      .then((rec) => {
        setRecord(rec)
        const parsed = parseLyrics(rec)
        setLines(parsed)
      })
      .catch(() => setError('Failed to load lyrics'))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    if (phase === 'playing') {
      inputRef.current?.focus()
    }
  }, [phase])

  const visibleLines = useMemo(() => {
    return lines.slice(currentIndex, currentIndex + visibleCount)
  }, [lines, currentIndex])

  const activeLine = visibleLines[0] ?? ''

  function handleStart() {
    if (lines.length === 0) return
    setPhase('playing')
    setInput('')
  }

  function handleRestart() {
    setPhase('idle')
    setCurrentIndex(0)
    setInput('')
  }

  function handleInputChange(next: string) {
    if (phase !== 'playing') return
    setInput(next)
    if (next === activeLine) {
      setCurrentIndex((i) => i + 1)
      setInput('')
      if (currentIndex + 1 >= lines.length) {
        setPhase('finished')
        if (record) {
          const songInfo = {
            id: record.id,
            trackName: record.trackName,
            artistName: record.artistName,
            albumName: record.albumName,
            playedAt: Date.now()
          }
          localStorage.setItem('profile.recentSong', JSON.stringify(songInfo))
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--color-home-bg) text-(--color-text)">
      <GameHeader artistName={record?.artistName} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-6">
        {isLoading && <div className="text-center">Loading…</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!isLoading && !error && record && (
          <div className="flex flex-col gap-6">
            <GameTitle
              trackName={record.trackName}
              phase={phase}
              onStart={handleStart}
              onRestart={handleRestart}
            />

            <LyricsDisplay lines={lines} visibleLines={visibleLines} />

            {phase === 'playing' && (
              <GameInput ref={inputRef} value={input} onChange={handleInputChange} />
            )}

            {phase === 'finished' && (
              <GameControls phase={phase} onStart={handleStart} onRestart={handleRestart} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
