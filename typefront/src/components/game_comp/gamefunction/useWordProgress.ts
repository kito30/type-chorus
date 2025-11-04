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
    // Record typed chunk for current word and advance
    setTypedWords(prev => ({ ...prev, [wordIndex]: chunk }))
    const finished = wordIndex + 1 >= words.length
    if (finished) {
      setWordIndex(0)
      setInput('')
      return { lineCompleted: true }
    }
    setWordIndex(w => w + 1)
    setInput('')
    return { lineCompleted: false }
  }, [wordIndex, words.length])

  return {
    input,
    wordIndex,
    typedWords,
    words,
    handleChange,
    handleSpace,
  }
}


