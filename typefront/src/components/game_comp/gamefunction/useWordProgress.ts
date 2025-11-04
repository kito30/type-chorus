import { useCallback, useEffect, useMemo, useState } from 'react'

export function useWordProgress(activeLine: string) {
  const [input, setInput] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [typedWords, setTypedWords] = useState<Record<number, string>>({})

  const words = useMemo(() => (activeLine ? activeLine.split(/\s+/) : []), [activeLine])

  // Reset progress when the active line changes
  useEffect(() => {
    setInput('')
    setWordIndex(0)
    setTypedWords({})
  }, [activeLine])

  const handleChange = useCallback((next: string) => {
    setInput(next)
  }, [])

  const handleSpace = useCallback((chunk: string) => {
    // If user pressed Space with no input, mark the whole word as incorrect visually
    const currentWord = words[wordIndex] || ''
    const recorded = chunk === '' && currentWord
      ? '!'.repeat(currentWord.length) // force per-char red highlighting
      : chunk
    // Record typed (or fail mask) for current word and advance
    setTypedWords(prev => ({ ...prev, [wordIndex]: recorded }))
    const finished = wordIndex + 1 >= words.length
    if (finished) {
      setWordIndex(0)
      setInput('')
      return { lineCompleted: true }
    }
    setWordIndex(w => w + 1)
    setInput('')
    return { lineCompleted: false }
  }, [wordIndex, words])

  return {
    input,
    wordIndex,
    typedWords,
    words,
    handleChange,
    handleSpace,
  }
}


