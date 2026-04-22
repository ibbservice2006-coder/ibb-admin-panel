const express = require('express')
const path = require('path')
const app = express()
const PORT = 4173

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback — all routes return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`IBB Shuttle Admin running at http://localhost:${PORT}`)
})
