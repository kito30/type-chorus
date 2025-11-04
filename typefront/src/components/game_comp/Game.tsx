import { useEffect, useRef, useState } from 'react'
import { createYouTubeController, type YouTubeController } from './gamefunction/videofunction'
import { useWordProgress } from './gamefunction/useWordProgress'
import { useScoring } from './gamefunction/useScoring'
import { useLyricSync } from './gamefunction/useLyricSync'
import ScoreHud from './ScoreHud'
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
  const [mountKey] = useState(() => Date.now())
  // Per-line typing managed by hook
  const { score, combo, correctChars, wrongChars, startedAtMs, resetAll, onInputChange, onSpace, onWordSubmit } = useScoring()
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

  // On full page refresh or mount, ensure state starts from idle and player is paused
  useEffect(() => {
    setPhase('idle')
    setCurrentIndex(0)
    try { controllerRef.current?.pause() } catch { /* ignore */ }
  }, [])


  useEffect(() => {
    if (iframeRef.current) {
      controllerRef.current = createYouTubeController(iframeRef.current)
    }
  }, [iframeRef])


  const activeLine = lines[currentIndex] ?? ''
  // typing progression handled by useWordProgress
  const { input, wordIndex, typedWords, words, handleChange, handleSpace } = useWordProgress(activeLine)
  // expectedWord no longer needed in Game; per-word validation is handled on space using the typed chunk

  // Sync lyrics to YouTube time via portable hook
  const LEAD_MS = 200
  const { currentIndex: syncedIndex, canType } = useLyricSync({
    timedLines,
    videoId,
    iframeRef,
    leadMs: LEAD_MS,
    enabled: phase === 'playing',
  })
  useEffect(() => {
    if (syncedIndex !== currentIndex) setCurrentIndex(syncedIndex)
  }, [syncedIndex, currentIndex])

  function handleStart() {
    if (lines.length === 0) return
    setPhase('playing')
    
    // typing hook resets on line change
    resetAll()
    
    wrongIndicesRef.current = new Set()
    // typing hook resets on line change
    try {
      // Ensure controller exists, then seek and play immediately on user gesture
      if (!controllerRef.current && iframeRef.current) {
        controllerRef.current = createYouTubeController(iframeRef.current);
      }
      controllerRef.current?.seekTo(0, true);
      // Autoplay policies are friendlier to muted playback
      controllerRef.current?.mute();
      controllerRef.current?.play();
      // Retry a few times in case the iframe isn't fully ready yet
      let attempts = 0
      const maxAttempts = 10
      const retry = () => {
        attempts += 1
        if (attempts >= maxAttempts) return
        controllerRef.current?.play()
        setTimeout(retry, 300)
      }
      setTimeout(retry, 300)
      // If the user explicitly started, we can unmute shortly after playback begins
      setTimeout(() => controllerRef.current?.unmute(), 400)
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  function handleRestart() {
    // Reset everything: seek to 0, pause, reset scores, go back to idle
    setPhase('idle')
    setCurrentIndex(0)
    resetAll(false) // Don't start timer - wait for Start button
    wrongIndicesRef.current = new Set()
    try {
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
    if (phase !== 'playing' || !canType) return
    // Check if line is completed but hasn't advanced yet (video hasn't reached next line)
    const lineCompleted = wordIndex === 0 && words.length > 0 && Object.keys(typedWords).length >= words.length
    if (lineCompleted && syncedIndex < currentIndex + 1) {
      // Line is done but video hasn't reached next line yet - ignore input
      return
    }
    onInputChange(words[wordIndex] || '', next)
    handleChange(next)
  }

  function handleAdvanceOnWord(chunk: string) {
    // If we're outside the typing window, let Space jump to the synced line
    if (!canType) {
      setCurrentIndex(syncedIndex)
      handleSpace('')
      onSpace()
      return
    }
    // Check if line is already completed but hasn't advanced yet
    const lineAlreadyCompleted = wordIndex === 0 && words.length > 0 && Object.keys(typedWords).length >= words.length
    if (lineAlreadyCompleted && syncedIndex < currentIndex + 1) {
      // Line is done but video hasn't reached next line yet - ignore Space key
      return
    }
    // Score by whole word only when allowed to type
    onWordSubmit(words[wordIndex] || '', chunk)
    const { lineCompleted } = handleSpace(chunk)
    onSpace()
    if (lineCompleted) {
      // Only advance to next line if video has reached that line's timestamp
      // syncedIndex represents what line the video is currently on
      const nextIndex = currentIndex + 1
      if (syncedIndex >= nextIndex) {
        // Video has reached the next line, allow advancement
        setCurrentIndex(nextIndex)
        if (nextIndex >= lines.length) {
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
      // If video hasn't reached next line yet, ignore the input (don't advance)
      // The syncedIndex will eventually catch up via the useEffect, and lyrics will advance naturally
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
