import type { SongInfo } from '../../types/music'

export function parseLyrics(rec: SongInfo): string[] {
  const lrc = rec.syncedLyrics
    const rows = lrc.split(/\r?\n/)
    const pairs: Array<{ t: number; text: string }> = []
    for (const row of rows) {
      const match = row.match(/^\[(\d{2}):(\d{2})\.(\d{2})\]\s*(.*)$/)
      if (!match) continue
      const m = Number(match[1])
      const s = Number(match[2])
      const cs = Number(match[3])
      const text = match[4] ?? ''
      const t = m * 60000 + s * 1000 + cs * 10
      pairs.push({ t, text })
    }
    pairs.sort((a, b) => a.t - b.t)
    return pairs.map((p) => p.text).filter((t) => t.trim().length > 0)
}

