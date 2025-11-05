// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchYouTubeVideo } from '../youtubeSearch.js'

// Mock YTMusic class used inside module as a constructable class
vi.mock('ytmusic-api', () => {
  return {
    default: class MockYTMusic {
      async initialize() { /* no-op */ }
      async search() { return mockResults }
    }
  }
})

let mockResults: any[] = []

describe('searchYouTubeVideo', () => {

  it('picks exact song match when available', async () => {
    mockResults = [
      { type: 'song', name: 'Hello', artist: { name: 'World' }, videoId: 'abc123', durationSeconds: 99 },
      { type: 'video', title: 'Other', youtubeId: 'zzz' },
    ]
    const out = await searchYouTubeVideo('Hello', 'World')
    expect(out.videoId).toBe('abc123')
  })

  it('throws when no playable id', async () => {
    mockResults = [{ type: 'song', name: 'X', artist: { name: 'Y' } }]
    await expect(searchYouTubeVideo('X', 'Y')).rejects.toThrow(/No playable videoId/i)
  })
})


