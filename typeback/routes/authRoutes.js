import { Router } from 'express';
import { getDb } from '../db.js';
import { hashPassword, verifyPassword, signToken } from '../utils/auth.js';
import { nanoid } from 'nanoid';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { email, username, password } = req.body || {};
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'email, username and password are required' });
  }
  const db = await getDb();
  const lower = String(email).toLowerCase();
  const existing = db.data.users.find(u => u.email === lower);
  if (existing) return res.status(409).json({ error: 'email already registered' });

  try {
    const passwordHash = await hashPassword(password);
    const user = { id: nanoid(), email: lower, username, password_hash: passwordHash, createdAt: new Date().toISOString() };
    db.data.users.push(user);
    await db.write();
    const token = signToken({ sub: user.id, email: user.email });
    const { password_hash, ...safeUser } = user;
    return res.status(201).json({ token, user: safeUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'failed to register' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  const db = await getDb();
  const row = db.data.users.find(u => u.email === String(email).toLowerCase());
  if (!row) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const user = { id: row.id, email: row.email, username: row.username, createdAt: row.createdAt };
  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ token, user });
});
