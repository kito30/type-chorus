import GameControls from './GameControls'

interface GameTitleProps {
  trackName: string
  phase: 'idle' | 'countdown' | 'playing' | 'finished'
  onStart: () => void
  onRestart: () => void
  onEnd?: () => void
}

export default function GameTitle({ trackName, phase, onStart, onRestart, onEnd }: GameTitleProps) {
  return (
    <div className="flex flex-row items-center justify-between w-full">
      <h1 className="text-2xl font-semibold truncate">{trackName}</h1>
      <GameControls phase={phase} onStart={onStart} onRestart={onRestart} onEnd={onEnd} />
    </div>
  )
}

