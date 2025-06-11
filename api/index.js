const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const { body, param, validationResult } = require('express-validator')
require('dotenv').config()

const app = express()
// Для Vercel и других прокси обязательно trust proxy
app.set('trust proxy', 1)

// Configuration
const config = {
	port: parseInt(process.env.PORT || '5001', 10),
	mongoUri:
		process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-telegram',
	environment: process.env.NODE_ENV || 'development',
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
}

// Security Configuration
const securityConfig = {
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
		contentSecurityPolicy:
			config.environment === 'development' ? false : undefined,
		crossOriginEmbedderPolicy: false
	},
	rateLimiting: {
		windowMs: 15 * 60 * 1000,
		max: config.environment === 'development' ? 1000 : 100
	}
}

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
		await mongoose.connect(uri)
		console.log('✅ MongoDB connected successfully')
	} catch (error) {
		console.error('❌ MongoDB connection error:', error)
	}
}

if (mongoose.connection.readyState === 0) {
	connectDB(config.mongoUri)
}

// Models
const projectSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 100 },
		description: { type: String, required: true, trim: true, maxlength: 500 },
		userId: { type: String, required: true }
	},
	{ timestamps: true }
)

const taskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true, maxlength: 200 },
		description: { type: String, trim: true, maxlength: 1000 },
		priority: {
			type: String,
			enum: ['high', 'medium', 'low'],
			default: 'medium'
		},
		completed: { type: Boolean, default: false },
		projectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
			required: true
		}
	},
	{ timestamps: true }
)

const Project =
	mongoose.models.Project || mongoose.model('Project', projectSchema)
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)

// Error Handler
const asyncHandler = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next)

// Validation
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

// Проверка projectId — только что это MongoId
const validateProjectId = [
	param('projectId').isString().withMessage('Invalid project ID'),
	handleValidationErrors
]

// Routes
app.get('/api/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		environment: config.environment,
		timestamp: new Date().toISOString()
	})
})

app.get(
	'/api/projects',
	asyncHandler(async (req, res) => {
		const { userId } = req.query
		if (!userId) {
			return res
				.status(400)
				.json({ success: false, error: 'User ID is required' })
		}
		const projects = await Project.find({ userId }).sort({ createdAt: -1 })
		res
			.status(200)
			.json({ success: true, count: projects.length, data: projects })
	})
)

// app.get(
// 	'/api/projects/:projectId/tasks',
// 	validateProjectId,
// 	asyncHandler(async (req, res) => {
// 		const { projectId } = req.params

// 		// Check if project exists
// 		const project = await Project.findById(projectId)
// 		if (!project) {
// 			return res
// 				.status(404)
// 				.json({ success: false, error: 'Project not found' })
// 		}

// 		const tasks = await Task.find({ projectId }).sort({ createdAt: -1 })
// 		res.status(200).json({ success: true, count: tasks.length, data: tasks })
// 	})
// )

// Получить задачи по проекту
app.get(
	'/api/projects/:projectId/tasks',
	validateProjectId,
	asyncHandler(async (req, res) => {
		const { projectId } = req.params
		try {
			const project = await Project.findById(projectId)
			if (!project) {
				return res.status(404).json({ success: false, error: 'Project not found' })
			}
			const tasks = await Task.find({ projectId }).sort({ createdAt: -1 })
			res.status(200).json({ success: true, count: tasks.length, data: tasks })
		} catch (error) {
			console.error('Error fetching tasks:', error)
			res.status(500).json({ success: false, error: 'Internal server error' })
		}
	})
)

// Создать задачу
app.post(
	'/api/tasks',
	asyncHandler(async (req, res) => {
		const { title, description, priority, projectId } = req.body
		if (!title || !projectId) {
			return res.status(400).json({ success: false, error: 'Title and projectId are required' })
		}
		try {
			const project = await Project.findById(projectId)
			if (!project) {
				return res.status(404).json({ success: false, error: 'Project not found' })
			}
			const task = await Task.create({
				title,
				description,
				priority,
				projectId,
				completed: false
			})
			res.status(201).json({ success: true, data: task })
		} catch (error) {
			console.error('Error creating task:', error)
			res.status(500).json({ success: false, error: 'Internal server error' })
		}
	})
)

// 404 обработчик
app.use('*', (req, res) => {
	res.status(404).json({ error: 'Route not found', path: req.originalUrl })
})

module.exports = app
