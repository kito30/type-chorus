import React from 'react'

export default function HighlightedWord({
  word,
  typed,
  isActive,
}: {
  word: string
  typed: string
  isActive?: boolean
}) {
  const limit = word.length
  return (
    <span className={isActive ? 'underline decoration-blue-400 decoration-2 underline-offset-4' : undefined}>
      {Array.from({ length: limit }).map((_, i) => {
        const expected = word[i]
        const got = typed[i]
        // Only color positions the user has "attempted" (i < typed.length)
        if (i < typed.length) {
          const ok = got === expected
          return (
            <span key={i} className={ok ? 'text-green-400' : 'text-red-400'}>{expected}</span>
          )
        }
        // Unattempted positions render as normal expected characters
        return (
          <span key={i} className="text-(--color-text)">{expected}</span>
        )
      })}
    </span>
  )
}


