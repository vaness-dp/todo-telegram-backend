/**
 * Application constants
 */

export const APP_CONSTANTS = {
	// Validation
	MIN_NAME_LENGTH: 3,
	MAX_NAME_LENGTH: 100,
	MAX_DESCRIPTION_LENGTH: 500,

	// Pagination
	DEFAULT_PAGE_SIZE: 10,
	MAX_PAGE_SIZE: 50,

	// Task priorities
	TASK_PRIORITIES: ['high', 'medium', 'low'] as const,

	// Rate limiting
	RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
	RATE_LIMIT_MAX_REQUESTS: 100,

	// Error messages
	ERRORS: {
		INVALID_ID: 'Invalid ID format',
		NOT_FOUND: 'Resource not found',
		UNAUTHORIZED: 'Not authorized',
		FORBIDDEN: 'Access forbidden',
		VALIDATION_ERROR: 'Validation error',
		SERVER_ERROR: 'Internal server error'
	},

	// Success messages
	SUCCESS: {
		CREATED: 'Resource created successfully',
		UPDATED: 'Resource updated successfully',
		DELETED: 'Resource deleted successfully'
	}
} as const

/**
 * Environment variables
 */
export const ENV = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 5001,
	MONGODB_URI:
		process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-telegram',
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
} as const

/**
 * Task priority type
 */
export type TaskPriority = (typeof APP_CONSTANTS.TASK_PRIORITIES)[number]

export const PRIORITY_LEVELS = {
	HIGH: 'high',
	MEDIUM: 'medium',
	LOW: 'low'
} as const

export const PRIORITY_ORDER = {
	high: 3,
	medium: 2,
	low: 1
}

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500
} as const

export const RESPONSE_MESSAGES = {
	PROJECT_CREATED: 'Project created successfully',
	PROJECT_UPDATED: 'Project updated successfully',
	PROJECT_DELETED: 'Project deleted successfully',
	TASK_CREATED: 'Task created successfully',
	TASK_UPDATED: 'Task updated successfully',
	TASK_DELETED: 'Task deleted successfully',
	TASK_COMPLETED: 'Task marked as completed',
	TASK_PENDING: 'Task marked as pending'
} as const
