import type { SongInfo, SongSearchResult } from '../types/music'
import {
  API_PATHS,
  getLrcHeaders,
  requestJson,
  setQueryParams,
  toLrcUrl,
} from './apiClient'

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
  const url = setQueryParams(toLrcUrl(API_PATHS.lrc.search), params)
  const data = await requestJson<RawSearchItem[]>(
    url,
    { headers: getLrcHeaders() },
    'Search failed'
  )
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
  return requestJson<SongInfo>(
    toLrcUrl(API_PATHS.lrc.byId(id)),
    { headers: getLrcHeaders() },
    'Get by id failed'
  )
}

export async function getLyricsById(id: number): Promise<SongInfo> {
  return requestJson<SongInfo>(
    toLrcUrl(API_PATHS.lrc.byId(id)),
    { headers: getLrcHeaders() },
    'Get by id failed'
  )
}

export async function getLyricsBySignature(params: {
  track_name: string
  artist_name: string
  album_name: string
  duration: number
}): Promise<SongInfo> {
  const url = setQueryParams(toLrcUrl(API_PATHS.lrc.bySignature), params)
  return requestJson<SongInfo>(
    url,
    { headers: getLrcHeaders() },
    'Get failed'
  )
}

export async function getLyricsBySignatureCached(params: {
  track_name: string
  artist_name: string
  album_name: string
  duration: number
}): Promise<SongInfo> {
  const url = setQueryParams(toLrcUrl(API_PATHS.lrc.bySignatureCached), params)
  return requestJson<SongInfo>(
    url,
    { headers: getLrcHeaders() },
    'Get-cached failed'
  )
}


