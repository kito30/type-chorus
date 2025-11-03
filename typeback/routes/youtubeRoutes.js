import express from 'express';
import { searchYouTubeVideo } from '../youtubeSearch.js';

const router = express.Router();

router.get('/youtube/search', async (req, res) => {
  try {
    const { title, artist } = req.query;
    const result = await searchYouTubeVideo(title, artist);
    return res.json(result);
  } catch (e) {
    console.error('API error:', e);
    
    if (e.message === 'title or artist required') {
      return res.status(400).json({ error: e.message });
    }
    
    return res.status(502).json({ error: 'yt-search failed' });
  }
});

export default router;

