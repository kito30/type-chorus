import { useCallback, useRef, useState } from 'react'

export interface ScoreState {
  score: number
  combo: number
  correctChars: number
  wrongChars: number
  startedAtMs: number | null
}

export function useScoring() {
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [wrongChars, setWrongChars] = useState(0)
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null)
  const prevInputRef = useRef('')

  const resetAll = useCallback((startTimer = true) => {
    setScore(0)
    setCombo(0)
    setCorrectChars(0)
    setWrongChars(0)
    setStartedAtMs(startTimer ? Date.now() : null)
    prevInputRef.current = ''
  }, [])

  const onInputChange = useCallback((expectedWord: string, nextValue: string) => {
    const prev = prevInputRef.current
    // Only consider newly typed character
    if (nextValue.length > prev.length) {
      const addedIndex = prev.length
      const addedChar = nextValue.charAt(addedIndex)
      const expectedChar = expectedWord.charAt(addedIndex)
      if (addedChar && expectedChar) {
        if (addedChar === expectedChar) {
          setScore((s) => s + 10)
          setCorrectChars((c) => c + 1)
          // simple combo increase
          setCombo((k) => k + 1)
        } else {
          setWrongChars((w) => w + 1)
          setCombo(0)
        }
      }
    }
    prevInputRef.current = nextValue
  }, [])

  const onSpace = useCallback(() => {
    prevInputRef.current = ''
  }, [])

  const onWordSubmit = useCallback((expectedWord: string, typed: string) => {
    const ok = typed === expectedWord
    if (ok) {
      const gain = Math.max(1, expectedWord.length) * 10
      setScore((s) => s + gain)
      setCorrectChars((c) => c + expectedWord.length)
      setCombo((k) => k + 1)
    } else {
      setWrongChars((w) => w + 1)
      setCombo(0)
    }
    return ok
  }, [])

  return {
    // state
    score,
    combo,
    correctChars,
    wrongChars,
    startedAtMs,
    // actions
    resetAll,
    onInputChange,
    onSpace,
    onWordSubmit,
  }
}


