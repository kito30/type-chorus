import React, { useEffect, useState } from 'react'
import HighlightedWord from './HighlightedWord'

interface LyricsDisplayProps {
  timedLines?: { timeMs: number; text: string }[]
  allLines?: string[]
  visibleCount?: number
  currentInput?: string
  wordIndex?: number
  currentLineIndex?: number
  typedWords?: Record<number, string>
}

export default function LyricsDisplay({
  timedLines,
  allLines,
  visibleCount = 5,
  currentInput,
  wordIndex = 0,
  currentLineIndex,
  typedWords = {},
}: LyricsDisplayProps) {
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    if (typeof currentLineIndex === 'number') {
      // When driven by parent (Game), always follow the provided index
      // Update immediately without checking if it changed to ensure sync
      setStartIndex(currentLineIndex)
      return
    }
  }, [timedLines, currentLineIndex])

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
              {isActive ? (
                (() => {
                  const words = line.split(/\s+/)
                  const typed = currentInput ?? ''
                  // Check if line is completed: wordIndex is 0 and we have all words in typedWords
                  const lineCompleted = wordIndex === 0 && words.length > 0 && Object.keys(typedWords).length >= words.length

                  // Render words via reusable component for portability
                  return (
                    <>
                      {words.map((w, wi) => {
                        let wordTyped = ''
                        if (lineCompleted) {
                          // Line is completed, show all words from typedWords
                          wordTyped = typedWords[wi] ?? ''
                        } else if (wi < wordIndex) {
                          // Previous words: use stored typed values
                          wordTyped = typedWords[wi] ?? ''
                        } else if (wi === wordIndex) {
                          // Current word: use live input
                          wordTyped = typed
                        }
                        // Otherwise wordTyped stays empty (not yet typed)

                        return (
                          <React.Fragment key={wi}>
                            <HighlightedWord
                              word={w}
                              typed={wordTyped}
                              isActive={wi === wordIndex && !lineCompleted}
                            />
                            {wi < words.length - 1 ? <span className="text-(--color-text)">{' '}</span> : null}
                          </React.Fragment>
                        )
                      })}
                    </>
                  )
                })()
              ) : (
                <>{line || ' '}</>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}



