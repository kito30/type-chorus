import 'dotenv/config'
import app from './app.js'
import { connectDb } from './db.js'

const port = process.env.PORT ? Number(process.env.PORT) : 3000


// Start after DB connects
// Log unexpected errors so we can diagnose early exits
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err)
})
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
})

const start = async () => {
  try {
    await connectDb();
    // Bind on all interfaces for Render; don't pass a host arg
    app.listen(port, () => console.log(`API server listening on port ${port}`))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start();

