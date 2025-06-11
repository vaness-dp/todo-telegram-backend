const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Configuration
const config = {
	port: parseInt(process.env.PORT || '5001', 10),
	mongoUri:
		process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-telegram',
	environment: process.env.NODE_ENV || 'development',
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
}

console.log('🔍 App Config loaded:')
console.log('Environment:', config.environment)
console.log('Frontend URL:', config.frontendUrl)

// Security Configuration
const getSecurityConfig = isDev => {
	return {
		cors: {
			origin: [
				config.frontendUrl,
				'http://localhost:3000',
				'https://todo-frontend-h25f8iv6y-vaness-dps-projects.vercel.app',
				'https://todo-frontend-orpin-one.vercel.app',
				/^https:\/\/todo-frontend-.*\.vercel\.app$/
			],
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization']
		},
		helmet: {
			contentSecurityPolicy: isDev ? false : undefined,
			crossOriginEmbedderPolicy: false
		},
		rateLimiting: {
			windowMs: 15 * 60 * 1000,
			max: isDev ? 1000 : 100
		}
	}
}

const securityConfig = getSecurityConfig(config.environment === 'development')

// Middleware
app.use(helmet(securityConfig.helmet))
app.use(cors(securityConfig.cors))
app.use(rateLimit(securityConfig.rateLimiting))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.disable('x-powered-by')

// Database Connection
const connectDB = async uri => {
	try {
		console.log('🔄 Connecting to MongoDB...')
		await mongoose.connect(uri)
		console.log('✅ MongoDB connected successfully')
		const dbName = mongoose.connection.db?.databaseName
		console.log(`📊 Database: ${dbName}`)
	} catch (error) {
		console.error('❌ MongoDB connection error:', error)
		throw error
	}
}

// Connect to database if not already connected
if (mongoose.connection.readyState === 0) {
	connectDB(config.mongoUri)
}

const projectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Project name is required'],
			trim: true,
			maxlength: [100, 'Project name cannot exceed 100 characters']
		},
		description: {
			type: String,
			required: [true, 'Project description is required'],
			trim: true,
			maxlength: [500, 'Project description cannot exceed 500 characters']
		},
		userId: {
			type: String,
			required: [true, 'User ID is required']
		}
	},
	{
		timestamps: true
	}
)

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Task title is required'],
			trim: true,
			maxlength: [200, 'Task title cannot exceed 200 characters']
		},
		description: {
			type: String,
			trim: true,
			maxlength: [1000, 'Task description cannot exceed 1000 characters']
		},
		priority: {
			type: String,
			enum: ['high', 'medium', 'low'],
			default: 'medium'
		},
		completed: {
			type: Boolean,
			default: false
		},
		projectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
			required: [true, 'Project ID is required']
		}
	},
	{
		timestamps: true
	}
)

const asyncHandler = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next)

const errorHandler = (err, req, res, next) => {
	let error = { ...err }
	error.message = err.message

	console.error(err)

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = 'Resource not found'
		error = { name: 'CastError', message, statusCode: 404 }
	}

	// Mongoose duplicate key
	if (err.name === 'MongoError' && err.code === 11000) {
		const message = 'Duplicate field value entered'
		error = { name: 'MongoError', message, statusCode: 400 }
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors)
			.map(val => val.message)
			.join(', ')
		error = { name: 'ValidationError', message, statusCode: 400 }
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	})
}

const { body, param, validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			error: 'Validation failed',
			details: errors.array()
		})
	}
	next()
}

const validateProject = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Project name is required')
		.isLength({ max: 100 })
		.withMessage('Project name cannot exceed 100 characters'),
	body('description')
		.trim()
		.notEmpty()
		.withMessage('Project description is required')
		.isLength({ max: 500 })
		.withMessage('Project description cannot exceed 500 characters'),
	body('userId').notEmpty().withMessage('User ID is required'),
	handleValidationErrors
]

const validateObjectId = [
	param('id').isMongoId().withMessage('Invalid ID format'),
	handleValidationErrors
]

const Project =
	mongoose.models.Project || mongoose.model('Project', projectSchema)
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)

// Project Controllers
const getProjects = asyncHandler(async (req, res) => {
	const { userId } = req.query

	if (!userId) {
		return res.status(400).json({
			success: false,
			error: 'User ID is required'
		})
	}

	const projects = await Project.find({ userId }).sort({ createdAt: -1 })

	res.status(200).json({
		success: true,
		count: projects.length,
		data: projects
	})
})

const getProject = asyncHandler(async (req, res) => {
	const project = await Project.findById(req.params.id)

	if (!project) {
		return res.status(404).json({
			success: false,
			error: 'Project not found'
		})
	}

	res.status(200).json({
		success: true,
		data: project
	})
})

const createProject = asyncHandler(async (req, res) => {
	const { name, description, userId } = req.body

	const project = await Project.create({
		name,
		description,
		userId
	})

	res.status(201).json({
		success: true,
		data: project
	})
})

// Routes
app.get('/api/projects', getProjects)
app.post('/api/projects', validateProject, createProject)
app.get('/api/projects/:id', validateObjectId, getProject)

// Health check
app.get('/api/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		environment: config.environment,
		timestamp: new Date().toISOString()
	})
})

// Root route
app.get('/api', (req, res) => {
	res.status(200).json({
		message: 'Todo Telegram API',
		version: '1.0.0',
		environment: config.environment
	})
})

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		error: 'Route not found',
		path: req.originalUrl
	})
})

// Global error handler
app.use(errorHandler)

// Export app (в самом конце файла!)
module.exports = app

// module.exports = app будет в самом конце!
