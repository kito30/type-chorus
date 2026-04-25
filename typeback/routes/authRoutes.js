import { Router } from 'express';
import { hashPassword, verifyPassword, signToken } from '../utils/auth.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../utils/auth.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { email, username, password } = req.body || {};
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'email, username and password are required' });
  }
  if(/[A-Z]/.test(email) || !email.includes('@')) {
    return res.status(400).json({ error: 'invalid email form' });
  }
  const existing = await User.findOne({ email }).lean();
  if (existing) return res.status(409).json({ error: 'email already registered' });

  try {
    const passwordHash = await hashPassword(password);
    const created = await User.create({ email, username, password_hash: passwordHash });
    const user = created.toJSON();
    const token = signToken({ sub: user.id, email: user.email });
    return res.status(201).json({ token, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to register' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  
  const row = await User.findOne({ username: username}).lean();
  if (!row) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const user = { id: row._id.toString(), email: row.email, username: row.username, createdAt: row.createdAt };
  const token = signToken({ sub: user.id, username: user.username });
  return res.json({ token, user });
});
authRouter.put('/update-username', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { username } = req.body || {};
    if (!userId) return res.status(401).json({ error: 'unauthorized' });
    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      return res.status(400).json({ error: 'invalid username' });
    }
    const existing = await User.findOne({ username }).lean();
    if (existing && existing._id.toString() !== userId) {
      return res.status(409).json({ error: 'username already taken' });
    }
    await User.updateOne({ _id: userId }, { username: username.trim() });
    const row = await User.findById(userId);
    if (!row) return res.status(404).json({ error: 'user not found' });
    const updated = row.toJSON();
    return res.json({ message: 'username updated', user: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to update username' });
  }
});

// Save recent song for current user
authRouter.post('/me/recent-song', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id, trackName, artistName, albumName, playedAt } = req.body || {};
    if (!userId) return res.status(401).json({ error: 'unauthorized' });
    if (!id || !trackName || !artistName) return res.status(400).json({ error: 'invalid payload' });
    await User.updateOne({ _id: userId }, { recentSong: { id, trackName, artistName, albumName, playedAt: playedAt || Date.now() } });
    const row = await User.findById(userId).lean();
    return res.json({ recentSong: row?.recentSong || null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to save recent song' });
  }
});

// Save a score entry for current user
authRouter.post('/me/score', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id, trackName, artistName, albumName, score, playedAt } = req.body || {};
    if (!userId) return res.status(401).json({ error: 'unauthorized' });
    if (!id || !trackName || !artistName || typeof score !== 'number') return res.status(400).json({ error: 'invalid payload' });
    const entry = { id, trackName, artistName, albumName, score, playedAt: playedAt || Date.now() };
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    const existing = Array.isArray(user.scores) ? user.scores : [];
    existing.push(entry);
    existing.sort((a, b) => b.score - a.score);
    user.scores = existing.slice(0, 50);
    await user.save();
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to save score' });
  }
});

// Fetch activity: recent song and top scores
authRouter.get('/me/activity', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: 'user not found' });
    const bestById = new Map();
    for (const s of user.scores || []) {
      const prev = bestById.get(s.id);
      if (!prev || s.score > prev.score) bestById.set(s.id, s);
    }
    const unique = Array.from(bestById.values()).sort((a, b) => b.score - a.score).slice(0, 5);
    return res.json({ recentSong: user.recentSong || null, topScores: unique });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to fetch activity' });
  }
});
authRouter.put('/change-password', authMiddleware, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

  const row = await User.findOne({ username: username}).lean();
  if (!row) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await verifyPassword(password, row.password_hash);
  console.log('Password match:', ok);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const newHash = await hashPassword(password);
  await User.updateOne({ username: username }, { password_hash: newHash });
  return res.status(200).json({ message: 'password changed successfully' });
});