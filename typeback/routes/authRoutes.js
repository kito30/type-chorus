import { Router } from 'express';
import { hashPassword, verifyPassword, signToken } from '../utils/auth.js';
import { User } from '../models/User.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { email, username, password } = req.body || {};
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'email, username and password are required' });
  }
  const lower = String(email).toLowerCase();
  const existing = await User.findOne({ email: lower }).lean();
  if (existing) return res.status(409).json({ error: 'email already registered' });

  try {
    const passwordHash = await hashPassword(password);
    const created = await User.create({ email: lower, username, password_hash: passwordHash });
    const user = created.toJSON();
    const token = signToken({ sub: user.id, email: user.email });
    return res.status(201).json({ token, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to register' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const lower = String(email).toLowerCase();
  const row = await User.findOne({ email: lower }).lean();
  if (!row) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const user = { id: row._id.toString(), email: row.email, username: row.username, createdAt: row.createdAt };
  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ token, user });
});
