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

    const startMs = Math.max(0, (timedLines[idx]?.timeMs ?? 0) - leadMs)
    const endMs = (idx + 1 < timedLines.length)
      ? Math.max(0, (timedLines[idx + 1].timeMs ?? 0) - leadMs)
      : Number.POSITIVE_INFINITY
    const inWindow = t >= startMs && t < endMs
    setCanType(inWindow)
    // Always update index to reflect video time, even if it's the same (handles seeks)
    setCurrentIndex(idx)
  }, [enabled, leadMs, timedLines, videoTimeSeconds])

  return { currentIndex, canType }
}


