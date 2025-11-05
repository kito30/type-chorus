// @ts-nocheck
import { vi } from 'vitest'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from '../pages/Profile'

vi.mock('../contexts/AuthContextType', () => ({
  useAuth: () => ({ user: { username: 'u', email: 'e' }, loading: false, isAuthenticated: true, logout: () => {}, token: 't', updateUser: () => {} })
}))

describe('Profile highest scores', () => {
  beforeEach(() => {
    localStorage.setItem('profile.scores', JSON.stringify([
      { id: 1, trackName: 'Track 1', artistName: 'A', score: 300, playedAt: Date.now() },
      { id: 2, trackName: 'Track 2', artistName: 'B', score: 500, playedAt: Date.now() },
    ]))
  })

  it('renders scores in descending order', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    )
    const items = screen.getAllByText(/Track /)
    expect(items[0].textContent || '').toMatch(/Track 2/)
    const scoreEl = screen.getByText('500')
    expect(document.body.contains(scoreEl)).toBe(true)
  })
})


