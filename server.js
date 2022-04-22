import express from 'express'
import cors from 'cors'
// import path from 'path'

const app = express()
const PORT = process.env.PORT || 3000

import hamsters from './routes/hamsters.js'
import matches from './routes/matches.js'
import matchWinners from './routes/matchWinners.js'
import winners from './routes/winners.js'
import losers from './routes/losers.js'

// const staticFolder = path.join(__dirname, 'public')

// Middleware
// CORS öppnar vårt projekt så det kan användas från andra domäner
app.use(cors())

// Parse request body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logger - skriv ut information om inkommande request
app.use((req, res, next) => {
  console.log(`Logger: ${req.method}  ${req.url} `, req.body)
  next()
})

// Serve static files in this folder
app.use(express.static('public'))

// Routes
app.use('/hamsters', hamsters)
app.use('/matches', matches)
app.use('/matchWinners', matchWinners)
app.use('/winners', winners)
app.use('/losers', losers)

// Starta server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`)
})
