import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { getAppConfig, getSecurityConfig } from './config/app.config'
import { errorHandler } from './middleware/errorHandler'
import projectRoutes from './routes/projects'
import taskRoutes from './routes/tasks'
import { connectDB } from './utils/database'

class Server {
	private app = express()
	private config = getAppConfig()
	private securityConfig = getSecurityConfig(
		this.config.environment === 'development'
	)

	constructor() {
		this.setupMiddleware()
		this.setupRoutes()
		this.setupErrorHandling()
	}

	private setupMiddleware(): void {
		// Security middleware
		this.app.use(helmet(this.securityConfig.helmet))
		this.app.use(cors(this.securityConfig.cors))
		this.app.use(rateLimit(this.securityConfig.rateLimiting))

		// Request parsing
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: true }))
		this.app.use(cookieParser())

		// Remove x-powered-by header
		this.app.disable('x-powered-by')
	}

	private setupRoutes(): void {
		// API routes
		this.app.use('/api/projects', projectRoutes)
		this.app.use('/api/tasks', taskRoutes)

		// Health check
		this.app.get('/health', (req, res) => {
			res.status(200).json({ status: 'ok' })
		})
	}

	private setupErrorHandling(): void {
		// Global error handler
		this.app.use(errorHandler)
	}

	public async start(): Promise<void> {
		try {
			// Connect to database
			await connectDB(this.config.mongoUri)
			console.log('✅ Connected to MongoDB')

			// Start server
			this.app.listen(this.config.port, () => {
				console.log(
					`🚀 Server running on port ${this.config.port} in ${this.config.environment} mode`
				)
			})
		} catch (error) {
			console.error('Failed to start server:', error)
			process.exit(1)
		}
	}
}

// Start server
const server = new Server()
server.start()
