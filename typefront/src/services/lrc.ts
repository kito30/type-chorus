import type { LyricsRecord, SongSearchResult } from '../types/music'

type RawSearchItem = {
  id: number
  trackName: string
  artistName: string
  albumName?: string
  duration?: number
  syncedLyrics?: string | null
  plainLyrics?: string | null
}

export async function searchSongs(params: {
  q?: string
  track_name?: string
  artist_name?: string
  album_name?: string
  duration?: number
}): Promise<SongSearchResult[]> {
  const url = new URL('/api/search', window.location.origin)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).length > 0) {
      url.searchParams.set(key, String(value))
    }
  }
  
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`)
  }
  const data = (await res.json()) as RawSearchItem[]
  return data.map((item) => ({
    id: item.id,
    trackName: item.trackName,
    artistName: item.artistName,
    albumName: item.albumName,
    duration: item.duration,
    hasSyncedLyrics: Boolean(item.syncedLyrics && item.syncedLyrics.length > 0),
    hasPlainLyrics: Boolean(item.plainLyrics && item.plainLyrics.length > 0),
  }))
}

export async function getLyricsById(id: number): Promise<LyricsRecord> {
  const url = new URL(`/api/get/${id}`, window.location.origin)
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get by id failed (${res.status})`)
  return (await res.json()) as LyricsRecord
}

export async function getLyricsBySignature(params: {
  track_name: string
  artist_name: string
  album_name: string
  duration: number
}): Promise<LyricsRecord> {
  const url = new URL('/api/get', window.location.origin)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get failed (${res.status})`)
  return (await res.json()) as LyricsRecord
}

export async function getLyricsBySignatureCached(params: {
  track_name: string
  artist_name: string
  album_name: string
  duration: number
}): Promise<LyricsRecord> {
  const url = new URL('/api/get-cached', window.location.origin)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get-cached failed (${res.status})`)
  return (await res.json()) as LyricsRecord
}

function buildHeaders(): HeadersInit {
  const appName = import.meta.env.VITE_APP_NAME || 'TypeChorus'
  const appVersion = import.meta.env.VITE_APP_VERSION || 'dev'
  return {
    'X-Client-Info': `${appName} v${appVersion}`,
  }
}


