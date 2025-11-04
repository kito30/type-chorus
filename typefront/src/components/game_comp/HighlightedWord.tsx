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
  const len = Math.min(typed.length, word.length)
  return (
    <span className={isActive ? 'underline decoration-blue-400 decoration-2 underline-offset-4' : undefined}>
      {Array.from({ length: len }).map((_, i) => {
        const ch = typed[i]
        const exp = word[i]
        const ok = ch === exp
        return (
          <span key={i} className={ok ? 'text-green-400' : 'text-red-400'}>{ch}</span>
        )
      })}
      <span className="text-(--color-text)">{word.slice(len)}</span>
    </span>
  )
}


