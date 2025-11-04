import { forwardRef } from 'react'

interface GameInputProps {
  value: string
  onChange: (value: string) => void
  onSpace?: (chunk: string) => void
}

const GameInput = forwardRef<HTMLInputElement, GameInputProps>(
  ({ value, onChange, onSpace }, ref) => {
    return (
      <input
        ref={ref}
        className="w-full rounded-lg bg-transparent border border-gray-700 px-4 py-3 
                  outline-none focus:ring-2 focus:ring-blue-500 text-lg caret-white"
        placeholder="Type here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault()
            const typed = String(value || '').trim()
            onSpace?.(typed)
            onChange('')
          }
        }}
        autoFocus
        
      />
    )
  }
)

GameInput.displayName = 'GameInput'

export default GameInput

