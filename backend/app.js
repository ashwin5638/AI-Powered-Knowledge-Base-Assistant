const express = require('express')
const documentRoutes = require('./src/routes/documentRoutes')
const ChatRoutes = require('./src/routes/ChatRoutes')
const authRoutes = require('./src/routes/authRoutes')
const dashboard = require('./src/routes/dashboardRoutes')
const errorHandler = require('./src/middleware/errorHandler')

const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
        res.status(200).json({
            message: "Sales Pilot AI API is running",  
        })
})

app.use('/api/auth', authRoutes)
app.use("/api/documents", documentRoutes)
app.use('/api/chat', ChatRoutes)
app.use('/api/dashboard', dashboard)

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.',
    })
  }
  if (err.message && err.message.includes('Only PDF')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
  next(err)
})

app.use(errorHandler)

module.exports = app
