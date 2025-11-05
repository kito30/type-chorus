// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameControls from '../components/game_comp/GameControls'

describe('GameControls End Song', () => {
  it('shows End Song in playing phase and calls onEnd', () => {
    const onEnd = vi.fn()
    const onRestart = vi.fn()
    const onStart = vi.fn()
    render(<GameControls phase="playing" onStart={onStart} onRestart={onRestart} onEnd={onEnd} />)
    const endBtn = screen.getByRole('button', { name: /end song/i })
    fireEvent.click(endBtn)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })
})


