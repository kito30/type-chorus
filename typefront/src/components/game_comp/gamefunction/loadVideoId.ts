import { fetchVideoInfo } from '../../../services/videofetch'
import type { SongInfo } from '../../../types/music'

export async function loadVideoId(
  rec: SongInfo, 
  setVideoId: (id: string) => void, 
  setRecord: (r: SongInfo) => void
) {
  if (!rec.videoId && rec.trackName && rec.artistName) {
    try {
      const videoInfo = await fetchVideoInfo(rec)
      if (videoInfo) {
        setVideoId(videoInfo.videoId)
        setRecord({ ...rec, videoId: videoInfo.videoId })
      }
    } catch (err) {
      console.error('Failed to fetch video:', err)
    }
  } else if (rec.videoId) {
    setVideoId(rec.videoId)
  }
}

