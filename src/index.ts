import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import projectRoutes from './routes/projects'
import taskRoutes from './routes/tasks'
import { errorHandler } from './middleware/errorHandler'

const mongoUri = process.env.MONGODB_URI
if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined in environment variables')
}
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

const app = express()
app.set('trust proxy', 1)

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://todo-frontend-h25f8iv6y-vaness-dps-projects.vercel.app',
  'https://todo-frontend-orpin-one.vercel.app',
  /^https:\/\/todo-frontend-.*\.vercel\.app$/
]
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 1000 : 100
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.disable('x-powered-by')

app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Todo Telegram API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  })
})

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  })
})

app.use(errorHandler)

export default app
