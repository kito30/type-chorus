interface GameControlsProps {
  phase: 'idle' | 'countdown' | 'playing' | 'finished'
  onStart: () => void
  onRestart: () => void
}

export default function GameControls({ phase, onStart, onRestart }: GameControlsProps) {
  if (phase === 'playing') {
    return (
      <button
        className="px-3 py-2 rounded bg-gray-800"
        onClick={onRestart}
      >
        Restart
      </button>
    )
  }

  if (phase === 'finished') {
    return (
      <div className="flex items-center gap-3">
        <div className="text-green-400">Completed</div>
        <button
          className="px-3 py-2 rounded bg-gray-800"
          onClick={onRestart}
        >
          Restart
        </button>
      </div>
    )
  }

  return (
    <button
      className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
      onClick={onStart}
    >
      Start
    </button>
  )
}

