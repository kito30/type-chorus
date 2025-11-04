import { useEffect, useState } from 'react'

export type Phase = 'idle' | 'countdown' | 'playing' | 'finished'

export function useGamePhase() {
  const [phase, setPhase] = useState<Phase>('idle')

  // Reset to idle on mount
  useEffect(() => {
    setPhase('idle')
  }, [])

  const start = () => setPhase('playing')
  const finish = () => setPhase('finished')
  const reset = () => setPhase('idle')

  return { phase, start, finish, reset }
}

