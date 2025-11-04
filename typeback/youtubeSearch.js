import YTMusic from 'ytmusic-api'

let ytmusic; // lazy singleton

async function getClient() {
  if (!ytmusic) {
    ytmusic = new YTMusic();
    await ytmusic.initialize(); // Optionally pass cookies for better results
  }
  return ytmusic;
}

export async function searchYouTubeVideo(title, artist) {
  const trimmedTitle = String(title || '').trim();
  const trimmedArtist = String(artist || '').trim();

  if (!trimmedTitle && !trimmedArtist) {
    throw new Error('title or artist required');
  }

  const query = [trimmedArtist, trimmedTitle].filter(Boolean).join(' ');

  try {
    const client = await getClient();
    const results = await client.search(query);

    // Prefer SONG results
  
    const songs = (results || []).filter((r) => (
        r?.type || '').toLowerCase() === 'song' && 
        r?.name?.toLowerCase() === trimmedTitle.toLowerCase() && 
        r?.artist?.name.toLowerCase() === trimmedArtist.toLowerCase());

    const pick = songs[0] || results[0] || null;
    if (!pick) {
      throw new Error(`No video found for: ${query}`);
    }

    const videoId = pick.videoId || pick.youtubeId || pick.id;
    if (!videoId) {
      throw new Error(`No playable videoId for: ${query}`);
    }

    const durationSeconds = pick.durationSeconds || pick.duration || 0;
    const channel = Array.isArray(pick.artists) && pick.artists.length > 0
      ? pick.artists.map(a => a.name).join(', ')
      : (pick.artist?.name || pick.author || '');

    return {
      videoId,
      title: pick.name || pick.title || '',
      channel,
      duration: durationSeconds,
      queryUsed: query,
      source: 'ytmusic-api',
    };
  } catch (e) {
    console.error('YouTube search error:', e);
    throw e;
  }
}

