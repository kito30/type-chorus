import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'MyS3cur3Rand0mK3y!2025TypeChorus#ProjectSecret';
const TOKEN_TTL = process.env.JWT_TTL || '7d';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.sub).lean()
      const { _id, password_hash, ...rest } = user;
      req.user = { id: _id.toString(), ...rest };
      // fetch fresh user data from MongoDB
     return next();
    } catch (e) {
      return res.status(401).json({ error: 'invalid token' });
    }
  }
  return res.status(401).json({ error: 'missing bearer token' });
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
