import 'dotenv/config'
import express from 'express'
import youtubeRoutes from './youtubeRoutes.js'
import cors from 'cors'
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

// youtube routes
app.use('/api', youtubeRoutes)


// Start after DB connects
const start = async () => {
  try {
   // await connectDb();
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start();

