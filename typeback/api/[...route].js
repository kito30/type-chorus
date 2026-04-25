import app from '../app.js'
import { connectDb } from '../db.js'

let dbConnectionPromise

async function ensureDbConnection() {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDb().catch((err) => {
      dbConnectionPromise = undefined
      throw err
    })
  }
  return dbConnectionPromise
}

export default async function handler(req, res) {
  try {
    await ensureDbConnection()
  } catch (err) {
    console.error('Database bootstrap failed:', err)
    return res.status(500).json({ error: 'backend unavailable' })
  }

  return app(req, res)
}
