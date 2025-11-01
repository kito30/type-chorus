import express from 'express'
import yts from 'yt-search'
const app = express()
const port = 3000

app.get('/api/youtube/search', async (req, res) => {
  const title = String(req.query.title || '').trim();
  const artist = String(req.query.artist || '').trim();

  if (!title && !artist) return res.status(400).json({ error: 'title or artist required' });
   
  const query = [artist, title].filter(Boolean).join(' ');

  try {
    const result = await yts(query);
    let vids = result.videos.slice(0, 10) || [];
    const norm = (s) => s.toLowerCase();
    const wantArtist = norm(artist);
    const wantTitle = norm(title);
    vids = vids.sort((a, b) => {
    // comparing each videos search result if the score is higher the put it in front
      const aScore =
        (wantArtist && norm(a.title).includes(wantArtist) ? 1 : 0) +
        (wantTitle && norm(a.title).includes(wantTitle) ? 1 : 0);
      const bScore =
        (wantArtist && norm(b.title).includes(wantArtist) ? 1 : 0) +
        (wantTitle && norm(b.title).includes(wantTitle) ? 1 : 0);
      return (
        (bScore - aScore) || 
        (b.views - a.views) // sort the views also
      );
    });
    const vid = vids[0] || null;
    return res.json({
      videoId: vid.videoId,
      title: vid.title,
      channel: vid.author.name,
      duration: vid.duration.seconds,
      queryUsed: query,
    })
  }
  catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'yt-search failed' });
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})