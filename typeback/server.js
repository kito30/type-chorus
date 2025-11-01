import express from 'express'
import apiRoutes from './routes.js'

const app = express()
const port = 3000

app.use('/api', apiRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})