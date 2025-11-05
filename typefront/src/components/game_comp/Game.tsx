import { useEffect, useRef, useState } from 'react'
import { useWordProgress } from './gamefunction/useWordProgress'
import { useScoring } from './gamefunction/useScoring'
import { useLyricSync } from './gamefunction/useLyricSync'
import { useVideoControl } from './gamefunction/useVideoControl'
import { useGamePhase } from './gamefunction/useGamePhase'
import { useLineAdvancement } from './gamefunction/useLineAdvancement'
import { useInputValidation } from './gamefunction/useInputValidation'
import { useGameCompletion } from './gamefunction/useGameCompletion'
import ScoreHud from './ScoreHud'
import GameTitle from './GameTitle'
import LyricsDisplay from './LyricsDisplay'
import GameInput from './GameInput'
import GameControls from './GameControls'
import GameHeader from './GameHeader'
import VideoCard from './VideoCard'
import { useGameData } from './gamefunction/useGameData'

export default function Game({ songId }: { songId: number }) {
  const { record, videoId, lines, timedLines, isLoading, error } = useGameData(songId)
  const [mountKey] = useState(() => Date.now())
  const visibleCount = 5
  const inputRef = useRef<HTMLInputElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // Game phase management
  const { phase, start: startPhase, finish: finishPhase, reset: resetPhase } = useGamePhase()

  // Video control
  const { startVideo, restartVideo, pauseVideo } = useVideoControl(iframeRef)

  // Scoring
  const { score, combo, correctChars, wrongChars, startedAtMs, resetAll, onInputChange, onSpace, onWordSubmit } = useScoring()

  // Game completion handling
  const { saveRecentSong, saveScore } = useGameCompletion()

  // Sync lyrics to YouTube time
  const LEAD_MS = 200
  const { currentIndex: syncedIndex, canType } = useLyricSync({
    timedLines,
    videoId,
    iframeRef,
    leadMs: LEAD_MS,
    enabled: phase === 'playing',
  })

  // Line advancement logic
  const { currentIndex, tryAdvanceToNext, reset: resetLineIndex } = useLineAdvancement({
    syncedIndex,
    totalLines: lines.length,
    onAllLinesComplete: () => {
      finishPhase()
      if (record) {
        saveRecentSong(record)
      }
    },
  })

  // Word progress for current line
  const activeLine = lines[currentIndex] ?? ''
  const { input, wordIndex, typedWords, words, handleChange, handleSpace } = useWordProgress(activeLine)

  // Input validation
  const { canProcessInput, canProcessSpace } = useInputValidation({
    phase,
    canType,
    wordIndex,
    words,
    typedWords,
    currentIndex,
    syncedIndex,
  })

  // Initialize video controller on mount
  useEffect(() => {
    pauseVideo()
    resetLineIndex()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Focus input when phase changes to playing
  useEffect(() => {
    if (phase === 'playing') {
      inputRef.current?.focus()
    }
  }, [phase])

  // Auto-focus when typing window opens
  useEffect(() => {
    if (phase === 'playing' && canType) {
      inputRef.current?.focus()
    }
  }, [canType, currentIndex, phase])

  // Blur and disable interactions when finished
  useEffect(() => {
    if (phase === 'finished') {
      try { inputRef.current?.blur() } catch {
        // Ignore errors on blur
      }
      pauseVideo()
    }
  }, [phase])

  function handleStart() {
    if (lines.length === 0) return
    startPhase()
    resetAll()
    resetLineIndex()
    startVideo()
  }

  function handleRestart() {
    resetPhase()
    resetLineIndex()
    resetAll(false) // Don't start timer - wait for Start button
    restartVideo()
  }

  function handleEnd() {
    // Manually end the song while playing
    finishPhase()
    pauseVideo()
    if (record) {
      saveRecentSong(record)
      saveScore(record, score)
    }
  }

  function handleInputChange(next: string) {
    if (!canProcessInput()) return
    onInputChange(words[wordIndex] || '', next)
    handleChange(next)
  }

  function handleAdvanceOnWord(chunk: string) {
    if (!canProcessSpace()) return

    // Score the word
    onWordSubmit(words[wordIndex] || '', chunk)
    const { lineCompleted } = handleSpace(chunk)
    onSpace()

    // Try to advance to next line if completed
    if (lineCompleted) {
      tryAdvanceToNext()
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
              <VideoCard videoId={videoId} iframeRef={iframeRef} reloadKey={mountKey} />
              <div className="flex flex-col items-center gap-6">
                <GameTitle
                  trackName={record.trackName}
                  phase={phase}
                  onStart={handleStart}
                  onRestart={handleRestart}
                  onEnd={handleEnd}
                />
                <ScoreHud score={score} combo={combo} correctChars={correctChars} wrongChars={wrongChars} startedAtMs={startedAtMs} />
                <LyricsDisplay
                  timedLines={timedLines}
                  allLines={lines}
                  visibleCount={visibleCount}
                  currentInput={input}
                  wordIndex={wordIndex}
                  typedWords={typedWords}
                  currentLineIndex={currentIndex}
                />
                {phase === 'playing' && (
                  <GameInput
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onSpace={(chunk) => { handleAdvanceOnWord(chunk) }}
                    disabled={!canType}
                  />
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
