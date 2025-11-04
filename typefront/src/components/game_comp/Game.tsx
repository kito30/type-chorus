import { useEffect, useRef, useState } from 'react'
import { createYouTubeController, type YouTubeController } from './gamefunction/videofunction'
import { useWordProgress } from './gamefunction/useWordProgress'
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
  // Per-line typing managed by hook
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [wrongChars, setWrongChars] = useState(0)
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const wrongIndicesRef = useRef<Set<number>>(new Set())
  const visibleCount = 5
  const inputRef = useRef<HTMLInputElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const controllerRef = useRef<YouTubeController | null>(null)


  useEffect(() => {
    if (phase === 'playing') {
      inputRef.current?.focus()
    }
  }, [phase])


  useEffect(() => {
    if (iframeRef.current) {
      controllerRef.current = createYouTubeController(iframeRef.current)
    }
  }, [iframeRef])


  const activeLine = lines[currentIndex] ?? ''
  // typing progression handled by useWordProgress
  const { input, wordIndex, typedWords, handleChange, handleSpace } = useWordProgress(activeLine)
  // expectedWord no longer needed in Game; per-word validation is handled on space using the typed chunk

  function handleStart() {
    if (lines.length === 0) return
    setPhase('playing')
    
    // typing hook resets on line change
    setScore(0)
    setCombo(0)
    setCorrectChars(0)
    setWrongChars(0)
    setStartedAtMs(Date.now())
    
    wrongIndicesRef.current = new Set()
    // typing hook resets on line change
    try {
      // Ensure controller exists, then seek and play immediately on user gesture
      if (!controllerRef.current && iframeRef.current) {
        controllerRef.current = createYouTubeController(iframeRef.current);
      }
      console.log('controllerRef.current', controllerRef.current);
      controllerRef.current?.seekTo(0, true);
      controllerRef.current?.play();
      // Retry shortly in case the iframe wasn't fully ready yet
      setTimeout(() => controllerRef.current?.play(), 200);
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  function handleRestart() {
    setPhase('idle')
    setCurrentIndex(0)
    setScore(0)
    setCombo(0)
    setCorrectChars(0)
    setWrongChars(0)
    setStartedAtMs(null)
    
    wrongIndicesRef.current = new Set()
    try {
      // Ensure controller exists, then seek to start and play
      if (!controllerRef.current && iframeRef.current) {
        controllerRef.current = createYouTubeController(iframeRef.current)
      }
      controllerRef.current?.seekTo(0, true)
      controllerRef.current?.pause()
    } catch (error) {
      console.error('Error restarting game:', error)
    }
  }

  function handleInputChange(next: string) {
    if (phase !== 'playing') return
    handleChange(next)
  }

  function handleAdvanceOnWord(chunk: string) {
    const { lineCompleted } = handleSpace(chunk)
    if (lineCompleted) {
      setCurrentIndex((i) => i + 1)
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
                <div className="fixed right-6 top-16 z-20 flex flex-col items-end gap-3">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow-lg">
                    <span className="uppercase tracking-wide text-xs opacity-70">Score</span>
                    <span className="text-2xl font-extrabold">{score}</span>
                  </div>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow">
                    <span className="uppercase tracking-wide text-xs opacity-70">Combo</span>
                    <span className="text-lg font-bold">{combo}</span>
                  </div>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow">
                    <span className="uppercase tracking-wide text-xs opacity-70">Accuracy</span>
                    <span className="text-lg font-bold">
                      {(() => {
                        const total = correctChars + wrongChars
                        return total === 0 ? '100%' : `${Math.round((correctChars / total) * 100)}%`
                      })()}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-(--color-card-bg, #101114) border border-gray-700 shadow">
                    <span className="uppercase tracking-wide text-xs opacity-70">WPM</span>
                    <span className="text-lg font-bold">
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
                  currentInput={input}
                  wordIndex={wordIndex}
                  typedWords={typedWords}
                  currentLineIndex={currentIndex}
                />
                {phase === 'playing' && (
                  <GameInput ref={inputRef} value={input} onChange={handleInputChange} onSpace={(chunk) => { handleAdvanceOnWord(chunk) }} />
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
