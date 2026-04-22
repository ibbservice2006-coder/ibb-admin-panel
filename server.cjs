const express = require('express')
const path = require('path')
const app = express()
const PORT = 4173

// สำหรับ assets (JS/CSS) — ให้ cache ได้ตามปกติ เพราะชื่อไฟล์มี hash
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
  maxAge: '1y',
  immutable: true
}))

// สำหรับ index.html — ห้าม cache เด็ดขาด เพื่อให้โหลด bundle ใหม่เสมอ
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
    }
  }
}))

// SPA fallback — all routes return index.html (no-cache)
app.get('/{*path}', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`IBB Shuttle Admin running at http://localhost:${PORT}`)
})
