import GameControls from './GameControls'

interface GameTitleProps {
  trackName: string
  phase: 'idle' | 'countdown' | 'playing' | 'finished'
  onStart: () => void
  onRestart: () => void
}

export default function GameTitle({ trackName, phase, onStart, onRestart }: GameTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold truncate">{trackName}</h1>
      <GameControls phase={phase} onStart={onStart} onRestart={onRestart} />
    </div>
  )
}

