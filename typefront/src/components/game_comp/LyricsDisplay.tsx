import React, { useEffect, useRef, useState } from 'react'
import { useYoutubeTime } from './gamefunction/useYoutubeTime'

interface LyricsDisplayProps {
  timedLines?: { timeMs: number; text: string }[]
  videoId: string
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  allLines?: string[]
  visibleCount?: number
}

export default function LyricsDisplay({
  timedLines,
  videoId,
  iframeRef,
  allLines,
  visibleCount = 5,
}: LyricsDisplayProps) {
  const [startIndex, setStartIndex] = useState(0)
  const prevRef = useRef(0)
  const currentTimeSeconds = useYoutubeTime(iframeRef, videoId || '')

  useEffect(() => {
    if (!timedLines || timedLines.length === 0) return
    if (typeof currentTimeSeconds !== 'number') return
    const leadMs = 200
    const nowMs = Math.max(0, Math.floor(currentTimeSeconds * 1000) + leadMs)
    let next = 0
    while (next + 1 < timedLines.length && timedLines[next + 1].timeMs <= nowMs) next++
    if (next !== prevRef.current) {
      prevRef.current = next
      setStartIndex(next)
    }
  }, [currentTimeSeconds, timedLines])

  const source = (timedLines && allLines && allLines.length === timedLines.length)
    ? allLines
    : (timedLines ? timedLines.map(l => l.text) : [])
  const slice = source.slice(startIndex, Math.min(source.length, startIndex + visibleCount))

  return (
    <div className="rounded-xl bg-(--color-card-bg, #101114) text-(--color-text) border border-gray-800 p-6 h-auto w-100">
      <ul className="space-y-2">
        {slice.map((line, i) => {
          const isActive = i === 0
          const isExiting = i === (visibleCount - 1)
          const opacityClass = isActive ? 'opacity-100' : isExiting ? 'opacity-0' : 'opacity-60'
          return (
            <li
              key={startIndex + i}
              className={`text-xl tracking-wide transition-opacity duration-500 ease-in-out ${opacityClass}`}
            >
              {line || ' '}
            </li>
          )
        })}
      </ul>
    </div>
  )
}



