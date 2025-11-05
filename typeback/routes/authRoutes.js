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
authRouter.put('/change-password', authMiddleware, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

  const row = await User.findOne({ username: username}).lean();
  if (!row) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await verifyPassword(password, row.password_hash);
  console.log('Password match:', ok);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  password_hash = await hashPassword(password);
  await User.updateOne({ username: username }, { password_hash: password_hash });
  return res.status(200).json({ message: 'password changed successfully' });
});