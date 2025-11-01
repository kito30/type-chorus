import { forwardRef } from 'react'

interface GameInputProps {
  value: string
  onChange: (value: string) => void
}

const GameInput = forwardRef<HTMLInputElement, GameInputProps>(
  ({ value, onChange }, ref) => {
    return (
      <input
        ref={ref}
        className="w-full rounded-lg bg-transparent border border-gray-700 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        placeholder="Type here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
    )
  }
)

GameInput.displayName = 'GameInput'

export default GameInput

