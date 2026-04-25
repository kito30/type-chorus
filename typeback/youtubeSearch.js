import ytsr from 'ytsr'

async function isEmbeddable(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
    return res.ok
  } catch {
    return false
  }
}

export async function searchYouTubeVideo(title, artist) {
  const trimmedTitle = String(title || '').trim()
  const trimmedArtist = String(artist || '').trim()

  if (!trimmedTitle && !trimmedArtist) {
    throw new Error('title or artist required')
  }

  const query = [trimmedArtist, trimmedTitle].filter(Boolean).join(' ')
  
  const results = await ytsr(query, { limit: 10 })
  const videos = results.items.filter(i => i.type === 'video')

  for (const video of videos) {
    const embeddable = await isEmbeddable(video.id)
    if (embeddable) {
      return {
        videoId: video.id,
        title: video.title,
        channel: video.author?.name || '',
        duration: video.duration || '',
        queryUsed: query,
        source: 'ytsr',
      }
    }
  }

  throw new Error(`No embeddable video found for: ${query}`)
}