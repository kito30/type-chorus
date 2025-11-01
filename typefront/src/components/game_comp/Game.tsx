import { useEffect, useMemo, useRef, useState } from 'react'
import GameTitle from './GameTitle'
import LyricsDisplay from './LyricsDisplay'
import GameInput from './GameInput'
import GameControls from './GameControls'
import GameHeader from './GameHeader'
import VideoCard from './VideoCard'
import { useGameData } from './gamefunction/useGameData'

type Phase = 'idle' | 'countdown' | 'playing' | 'finished'

export default function Game({ songId }: { songId: number }) {
  const { record, videoId, lines, isLoading, error } = useGameData(songId)
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const visibleCount = 3
  const inputRef = useRef<HTMLInputElement | null>(null)

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
    <>
      {isLoading && <div className="text-center">Loading…</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!isLoading && !error && record && (
        <>
          <GameHeader artistName={record.artistName} />
          <div className="w-full mx-auto px-6 pt-0 pb-6">
            <div className="flex flex-col items-center gap-12">
              <VideoCard videoId={videoId} />
              <div className="flex flex-col items-center gap-6">
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
              </div>
              {phase === 'finished' && (
                <GameControls phase={phase} onStart={handleStart} onRestart={handleRestart} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
