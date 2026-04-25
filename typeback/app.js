import express from 'express'
import cors from 'cors'
import youtubeRoutes from './routes/youtubeRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { authMiddleware } from './utils/auth.js'

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

const app = express()

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN || true }))
app.use(express.json())

// Health
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({ status: 'ok' })
})

// Auth
app.use(['/api/auth', '/auth'], authRouter)

// Protected current-user route
app.get(['/api/me', '/me'], authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

// youtube routes
app.use(['/api', '/'], youtubeRoutes)

export default app
