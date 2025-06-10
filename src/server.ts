import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler'
import projectRoutes from './routes/projects'
import taskRoutes from './routes/tasks'
import { connectDB } from './utils/database'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Security middleware
app.use(
	helmet({
		contentSecurityPolicy: false // Disable for development
	})
)

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true
	})
)

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: {
		success: false,
		error: 'Too many requests from this IP, please try again later.'
	}
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
	app.use((req, res, next) => {
		console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`)
		next()
	})
}

// Routes
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({
		success: true,
		status: 'OK',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development'
	})
})

// Root endpoint
app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Todo Telegram Backend API',
		version: '1.0.0',
		endpoints: {
			health: '/health',
			projects: '/api/projects',
			tasks: '/api/tasks'
		}
	})
})

// Handle 404 for undefined routes
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		error: `Route ${req.originalUrl} not found`
	})
})

// Error handling middleware (должен быть последним)
app.use(errorHandler)

// Connect to database and start server
const startServer = async () => {
	try {
		console.log('🚀 Starting server...')

		// Connect to MongoDB
		await connectDB()
		console.log('✅ Database connected successfully')

		// Start listening
		const server = app.listen(PORT, () => {
			console.log(`✅ Server running on port ${PORT}`)
			console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
			console.log(`📋 Health check: http://localhost:${PORT}/health`)
			console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
		})

		// Graceful shutdown
		process.on('SIGTERM', () => {
			console.log('👋 SIGTERM received, shutting down gracefully')
			server.close(() => {
				console.log('💤 Process terminated')
			})
		})
	} catch (error) {
		console.error('❌ Failed to start server:', error)
		process.exit(1)
	}
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
	console.error('❌ Unhandled Promise Rejection:', err.message)
	process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
	console.error('❌ Uncaught Exception:', err.message)
	process.exit(1)
})

// Start the server
startServer()

export default app
