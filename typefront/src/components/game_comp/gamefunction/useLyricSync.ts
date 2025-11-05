import { useEffect, useState } from 'react'
import { useYoutubeTime } from './useYoutubeTime'

export function useLyricSync({
  timedLines,
  videoId,
  iframeRef,
  leadMs = 200,
  enabled = true,
}: {
  timedLines?: { timeMs: number; text: string }[]
  videoId?: string
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  leadMs?: number
  enabled?: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canType, setCanType] = useState(false)

  const videoTimeSeconds = useYoutubeTime(iframeRef, videoId || '')

  useEffect(() => {
    if (!enabled) {
      setCanType(false)
      return
    }
    if (!timedLines || timedLines.length === 0) {
      // No timing provided → allow free typing and keep index 0
      setCanType(true)
      setCurrentIndex(0)
      return
    }
    if (typeof videoTimeSeconds !== 'number' || Number.isNaN(videoTimeSeconds) || videoTimeSeconds <= 0) {
      // Video time not ready yet → allow typing on the first line
      setCanType(true)
      setCurrentIndex(0)
      return
    }

    const t = Math.max(0, Math.floor(videoTimeSeconds * 1000))
    // Find the active line: the last line whose start time (minus lead) has been reached
    let idx = 0
    while (
      idx + 1 < timedLines.length &&
      t >= Math.max(0, (timedLines[idx + 1].timeMs ?? 0) - leadMs)
    ) {
      idx++
    }

    const currentLineTime = timedLines[idx]?.timeMs ?? 0
    const startMs = currentLineTime - leadMs // Allow typing 200ms before the line timestamp
    const endMs = (idx + 1 < timedLines.length)
      ? (timedLines[idx + 1].timeMs ?? 0) - leadMs
      : Number.POSITIVE_INFINITY
    
    // Allow typing when we're at or past the start time (200ms before timestamp)
    // Also allow a buffer (500ms) before the start time to handle timing edge cases
    // This applies to all lines including the first one
    const timeUntilStart = startMs - t
    const canTypeNow = t >= startMs || (timeUntilStart > 0 && timeUntilStart <= 500)
    const inWindow = canTypeNow && t < endMs
    
    setCanType(inWindow)
    // Always update index to reflect video time, even if it's the same (handles seeks)
    setCurrentIndex(idx)
  }, [enabled, leadMs, timedLines, videoTimeSeconds])

  return { currentIndex, canType }
}


