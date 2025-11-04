import { useEffect, useRef, useState } from 'react'
import GameTitle from './GameTitle'
import LyricsDisplay from './LyricsDisplay'
import GameInput from './GameInput'
import GameControls from './GameControls'
import GameHeader from './GameHeader'
import VideoCard from './VideoCard'
import { useGameData } from './gamefunction/useGameData'

type Phase = 'idle' | 'countdown' | 'playing' | 'finished'

export default function Game({ songId }: { songId: number }) {
  const { record, videoId, lines, timedLines, isLoading, error } = useGameData(songId)
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [wrongChars, setWrongChars] = useState(0)
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const [lineStartedAtMs, setLineStartedAtMs] = useState<number | null>(null)
  const wrongIndicesRef = useRef<Set<number>>(new Set())
  const visibleCount = 5
  const inputRef = useRef<HTMLInputElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)


  useEffect(() => {
    if (phase === 'playing') {
      inputRef.current?.focus()
    }
  }, [phase])


  const activeLine = lines[currentIndex] ?? ''

  function handleStart() {
    if (lines.length === 0) return
    setPhase('playing')
    setInput('')
    setScore(0)
    setCombo(0)
    setCorrectChars(0)
    setWrongChars(0)
    setStartedAtMs(Date.now())
    setLineStartedAtMs(Date.now())
    wrongIndicesRef.current = new Set()
  }

  function handleRestart() {
    setPhase('idle')
    setCurrentIndex(0)
    setInput('')
    setScore(0)
    setCombo(0)
    setCorrectChars(0)
    setWrongChars(0)
    setStartedAtMs(null)
    setLineStartedAtMs(null)
    wrongIndicesRef.current = new Set()
  }

  function handleInputChange(next: string) {
    if (phase !== 'playing') return
    const prev = input
    if (next.length > prev.length) {
      const addedIndex = next.length - 1
      const addedChar = next.charAt(addedIndex)
      const expectedChar = activeLine.charAt(addedIndex)
      if (addedChar === expectedChar) {
        setCorrectChars((c) => c + 1)
        const nextCombo = combo + 1
        setCombo(nextCombo)
        const multiplier = nextCombo >= 50 ? 2 : nextCombo >= 25 ? 1.5 : nextCombo >= 10 ? 1.2 : 1
        setScore((s) => s + Math.round(1 * multiplier))
      } else {
        if (!wrongIndicesRef.current.has(addedIndex)) {
          wrongIndicesRef.current.add(addedIndex)
          setWrongChars((w) => w + 1)
          setCombo(0)
          setScore((s) => s - 1)
        }
      }
    }
    if (next.length < prev.length) {
      const keep = new Set<number>()
      wrongIndicesRef.current.forEach((idx) => {
        if (idx < next.length) keep.add(idx)
      })
      wrongIndicesRef.current = keep
    }
    setInput(next)
    if (next === activeLine) {
      setCurrentIndex((i) => i + 1)
      setInput('')
      const now = Date.now()
      const elapsed = lineStartedAtMs ? now - lineStartedAtMs : 0
      let windowMs = 3000
      if (timedLines && timedLines[currentIndex] && timedLines[currentIndex + 1]) {
        const start = timedLines[currentIndex].timeMs
        const end = timedLines[currentIndex + 1].timeMs
        windowMs = Math.max(1000, end - start)
      }
      const ratio = Math.max(0, Math.min(1, 1 - (elapsed / windowMs)))
      const baseBonus = 50
      const bonusRaw = baseBonus * ratio
      const currentCombo = combo
      const multiplier = currentCombo >= 50 ? 2 : currentCombo >= 25 ? 1.5 : currentCombo >= 10 ? 1.2 : 1
      setScore((s) => s + Math.round(bonusRaw * multiplier))
      wrongIndicesRef.current = new Set()
      setLineStartedAtMs(now)
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
              <VideoCard videoId={videoId} iframeRef={iframeRef} />
              <div className="flex flex-col items-center gap-6">
                <GameTitle
                  trackName={record.trackName}
                  phase={phase}
                  onStart={handleStart}
                  onRestart={handleRestart}
                />
                <div className="w-full flex items-center justify-center gap-6 text-sm opacity-90">
                  <div>Score: <span className="font-semibold">{score}</span></div>
                  <div>Combo: <span className="font-semibold">{combo}</span></div>
                  <div>
                    Accuracy: <span className="font-semibold">
                      {(() => {
                        const total = correctChars + wrongChars
                        return total === 0 ? '100%' : `${Math.round((correctChars / total) * 100)}%`
                      })()}
                    </span>
                  </div>
                  <div>
                    WPM: <span className="font-semibold">
                      {(() => {
                        const start = startedAtMs
                        if (!start) return 0
                        const minutes = Math.max(0.001, (Date.now() - start) / 60000)
                        return Math.round((correctChars / 5) / minutes)
                      })()}
                    </span>
                  </div>
                </div>
                <LyricsDisplay
                  timedLines={timedLines}
                  videoId={videoId}
                  iframeRef={iframeRef}
                  allLines={lines}
                  visibleCount={visibleCount}
                />
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
