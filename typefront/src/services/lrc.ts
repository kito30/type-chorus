// Allow a dedicated LRC backend base separate from the main API base
const LRC_BASE = import.meta.env.LRC_BASE;
// If pointing directly to lrclib.net, use their native /api/* routes; else assume proxy under /api/lrc/*
const lrcPrefix = (LRC_BASE || '').includes('lrclib.net') ? '/api' : '/api/lrc'
import type { SongInfo, SongSearchResult } from '../types/music'

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
  const url = new URL(`${lrcPrefix}/search`, LRC_BASE)
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
  const results: SongSearchResult[] = data.map((item) => ({
    id: item.id,
    trackName: item.trackName,
    artistName: item.artistName,
    albumName: item.albumName,
    duration: item.duration,
    hasSyncedLyrics: Boolean(item.syncedLyrics && item.syncedLyrics.length > 0),
    hasPlainLyrics: Boolean(item.plainLyrics && item.plainLyrics.length > 0),
  }))
  // Return only items that have synced lyrics
  return results.filter(r => r.hasSyncedLyrics)
}

export async function getSongInfoById(id: number): Promise<SongInfo> {
  const url = new URL(`${lrcPrefix}/get/${id}`, LRC_BASE)
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get by id failed (${res.status})`)
  return (await res.json()) as SongInfo
}

export async function getLyricsById(id: number): Promise<SongInfo> {
  const url = new URL(`${lrcPrefix}/get/${id}`, LRC_BASE)
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get by id failed (${res.status})`)
  return (await res.json()) as SongInfo
}

export async function getLyricsBySignature(params: {
  track_name: string
  artist_name: string
  album_name: string
  duration: number
}): Promise<SongInfo> {
  const url = new URL(`${lrcPrefix}/get`, LRC_BASE)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get failed (${res.status})`)
  return (await res.json()) as SongInfo
}

export async function getLyricsBySignatureCached(params: {
  track_name: string
  artist_name: string
  album_name: string
  duration: number
}): Promise<SongInfo> {
  const url = new URL(`${lrcPrefix}/get-cached`, LRC_BASE)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  const res = await fetch(url.toString(), { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Get-cached failed (${res.status})`)
  return (await res.json()) as SongInfo
}

function buildHeaders(): HeadersInit {
  const appName = import.meta.env.VITE_APP_NAME || 'TypeChorus'
  const appVersion = import.meta.env.VITE_APP_VERSION || 'dev'
  // LRCLIB allows 'lrclib-client' or 'x-user-agent'
  return (LRC_BASE || '').includes('lrclib.net')
    ? { 'lrclib-client': `${appName} v${appVersion}` }
    : { 'X-Client-Info': `${appName} v${appVersion}` }
}


