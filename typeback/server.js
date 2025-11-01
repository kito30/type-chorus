import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import yts from 'yt-search'
import { authRouter } from './routes/authRoutes.js'
import { authMiddleware } from './utils/auth.js'
import { connectDb } from './db.js'

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(express.json())

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Auth
app.use('/api/auth', authRouter)

// Protected current-user route
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

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
// Start after DB connects
const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()