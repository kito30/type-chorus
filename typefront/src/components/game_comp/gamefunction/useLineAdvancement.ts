import { useState, useEffect, useCallback } from 'react'

interface UseLineAdvancementProps {
  syncedIndex: number
  totalLines: number
  onAllLinesComplete?: () => void
}

export function useLineAdvancement({
  syncedIndex,
  totalLines,
  onAllLinesComplete,
}: UseLineAdvancementProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Sync with video time
  useEffect(() => {
    if (syncedIndex !== currentIndex) {
      setCurrentIndex(syncedIndex)
    }
  }, [syncedIndex, currentIndex])

  // Check if we can advance to next line (video must have reached it)
  const canAdvanceToNext = useCallback((nextIndex: number) => {
    return syncedIndex >= nextIndex
  }, [syncedIndex])

  // Advance to next line if video has reached it
  const tryAdvanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (canAdvanceToNext(nextIndex)) {
      setCurrentIndex(nextIndex)
      if (nextIndex >= totalLines) {
        onAllLinesComplete?.()
      }
      return true
    }
    return false
  }, [currentIndex, canAdvanceToNext, totalLines, onAllLinesComplete])

  const reset = useCallback(() => {
    setCurrentIndex(0)
  }, [])

  return { currentIndex, setCurrentIndex, tryAdvanceToNext, canAdvanceToNext, reset }
}

