import express from 'express'
import cors from 'cors'
import youtubeRoutes from './routes/youtubeRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { authMiddleware } from './utils/auth.js'
import { isDbConnected } from './db.js'

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

const app = express()

function requireDatabase(_req, res, next) {
  if (isDbConnected()) {
    return next()
  }
  return res.status(503).json({ error: 'database unavailable' })
}

// Middleware
app.use(cors({ 
  origin: FRONTEND_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Health
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok' })
})

// Auth
app.use(['/api/auth', '/auth'], requireDatabase, authRouter)

// Protected current-user route
app.get(['/api/me', '/me'], requireDatabase, authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

// youtube routes
app.use(['/api', '/'], youtubeRoutes)

export default app
