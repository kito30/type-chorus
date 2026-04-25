import ytsr from 'ytsr'

export async function searchYouTubeVideo(title, artist) {
  const trimmedTitle = String(title || '').trim()
  const trimmedArtist = String(artist || '').trim()

  if (!trimmedTitle && !trimmedArtist) {
    throw new Error('title or artist required')
  }

  const query = [trimmedArtist, trimmedTitle].filter(Boolean).join(' ')
  
  const results = await ytsr(query, { limit: 5 })
  const videos = results.items.filter(i => i.type === 'video')
  const pick = videos[0]

  if (!pick) throw new Error(`No video found for: ${query}`)

  return {
    videoId: pick.id,
    title: pick.title,
    channel: pick.author?.name || '',
    duration: pick.duration || '',
    queryUsed: query,
    source: 'ytsr',
  }
}