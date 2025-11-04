import type { SongInfo, LyricLine } from '../../types/music'



export function parseLyrics(rec: SongInfo): string[] {
  const lrc = rec.syncedLyrics
    const rows = lrc.split(/\r?\n/)
    const pairs: Array<{ t: number; text: string }> = []
    for (const row of rows) {
      // supports [mm:ss.xx] or [mm:ss.xxx]
      const match = row.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)$/)
      if (!match) continue
      const m = Number(match[1])
      const s = Number(match[2])
      const frac = match[3]
      // convert fractional part to milliseconds (supports centiseconds or milliseconds)
      const ms = frac.length === 2 ? Number(frac) * 10 : Number(frac)
      const text = match[4] ?? ''
      const t = m * 60000 + s * 1000 + ms
      pairs.push({ t, text })
    }
    pairs.sort((a, b) => a.t - b.t)
    return pairs.map((p) => p.text).filter((t) => t.trim().length > 0)
}


// New: returns timestamps suitable for syncing with YouTube time
// timeMs aligns with getCurrentTime()*1000 from the YouTube IFrame API
export function parseLyricsWithTimestamps(rec: SongInfo): LyricLine[] {
  const lrc = rec.syncedLyrics
  const rows = lrc.split(/\r?\n/)
  const lines: LyricLine[] = []
  for (const row of rows) {
    // supports [mm:ss.xx] or [mm:ss.xxx]
    const match = row.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)$/)
    if (!match) continue
    const m = Number(match[1])
    const s = Number(match[2])
    const frac = match[3]
    const text = (match[4] ?? '').trim()
    if (!text) continue
    const ms = frac.length === 2 ? Number(frac) * 10 : Number(frac)
    const timeMs = m * 60000 + s * 1000 + ms
    lines.push({ timeMs, text })
  }
  lines.sort((a, b) => a.timeMs - b.timeMs)
  return lines
}
