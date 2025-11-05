// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Search from '../components/search/Search'

vi.mock('../services/lrc', () => ({
  searchSongs: vi.fn(async ({ q }: { q: string }) => {
    if (!q || q.length < 2) return []
    return [
      { id: 1, trackName: 'Song A', artistName: 'Artist A', albumName: 'Album', duration: 120, hasSyncedLyrics: true, hasPlainLyrics: true },
      { id: 2, trackName: 'Song B', artistName: 'Artist B', albumName: 'Album', duration: 180, hasSyncedLyrics: true, hasPlainLyrics: false },
    ]
  }),
}))

// useNavigate stub
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return { ...actual, useNavigate: () => vi.fn() }
})

describe('Home search flow', () => {
  it('debounces and shows results list for >=2 chars', async () => {
    render(<Search />)
    const input = screen.getByPlaceholderText(/search songs or artists/i)
    fireEvent.change(input, { target: { value: 'so' } })

    await waitFor(() => {
      const a = screen.getByText(/Song A/i)
      const b = screen.getByText(/Song B/i)
      expect(document.body.contains(a)).toBe(true)
      expect(document.body.contains(b)).toBe(true)
    })
  })
})


