interface UseInputValidationProps {
  phase: 'idle' | 'countdown' | 'playing' | 'finished'
  canType: boolean
  wordIndex: number
  words: string[]
  typedWords: Record<number, string>
  currentIndex: number
  syncedIndex: number
}

export function useInputValidation({
  phase,
  canType,
  wordIndex,
  words,
  typedWords,
  currentIndex,
  syncedIndex,
}: UseInputValidationProps) {
  const isLineCompleted = () => {
    return wordIndex === 0 && words.length > 0 && Object.keys(typedWords).length >= words.length
  }

  const isWaitingForNextLine = () => {
    return isLineCompleted() && syncedIndex < currentIndex + 1
  }

  const canProcessInput = () => {
    if (phase !== 'playing' || !canType) return false
    if (isWaitingForNextLine()) return false
    return true
  }

  const canProcessSpace = () => {
    if (!canType) return false
    if (isWaitingForNextLine()) return false
    return true
  }

  return { isLineCompleted, isWaitingForNextLine, canProcessInput, canProcessSpace }
}

