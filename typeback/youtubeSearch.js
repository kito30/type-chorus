import yts from 'yt-search'

export async function searchYouTubeVideo(title, artist) {
  const trimmedTitle = String(title || '').trim();
  const trimmedArtist = String(artist || '').trim();

  if (!trimmedTitle && !trimmedArtist) {
    throw new Error('title or artist required');
  }

  const query = [trimmedArtist, trimmedTitle].filter(Boolean).join(' ');

  try {
    const result = await yts(query);
    let vids = result.videos.slice(0, 10) || [];
    const norm = (s) => s.toLowerCase();
    const wantArtist = norm(trimmedArtist);
    const wantTitle = norm(trimmedTitle);

    vids = vids.sort((a, b) => {
      // First priority: Check if video author matches artist
      const aArtistMatch = wantArtist && norm(a.author.name).includes(wantArtist) ? 1 : 0;
      const bArtistMatch = wantArtist && norm(b.author.name).includes(wantArtist) ? 1 : 0;

      // Second priority: Views
      const viewsDiff = b.views - a.views;

      // Third priority: Title score
      const aScore =
        (wantArtist && norm(a.title).includes(wantArtist) ? 1 : 0) +
        (wantTitle && norm(a.title).includes(wantTitle) ? 1 : 0);
      const bScore =
        (wantArtist && norm(b.title).includes(wantArtist) ? 1 : 0) +
        (wantTitle && norm(b.title).includes(wantTitle) ? 1 : 0);

      // Sort by: artist match first, then views, then title score
      return (bArtistMatch - aArtistMatch) || viewsDiff || (bScore - aScore);
    });

    const vid = vids[0] || null;

    if (!vid) {
      throw new Error('No video found');
    }

    return {
      videoId: vid.videoId,
      title: vid.title,
      channel: vid.author.name,
      duration: vid.duration.seconds,
      queryUsed: query,
    };
  } catch (e) {
    console.error('YouTube search error:', e);
    throw e;
  }
}

