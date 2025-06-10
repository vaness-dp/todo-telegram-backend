import type { NextFunction, Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'

export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

export const validateProject = [
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

export const validateUpdateProject = [
	body('name')
		.optional()
		.trim()
		.notEmpty()
		.withMessage('Project name cannot be empty')
		.isLength({ max: 100 })
		.withMessage('Project name cannot exceed 100 characters'),
	body('description')
		.optional()
		.trim()
		.notEmpty()
		.withMessage('Project description cannot be empty')
		.isLength({ max: 500 })
		.withMessage('Project description cannot exceed 500 characters'),
	handleValidationErrors
]

export const validateTask = [
	body('title')
		.trim()
		.notEmpty()
		.withMessage('Task title is required')
		.isLength({ max: 200 })
		.withMessage('Task title cannot exceed 200 characters'),
	body('description')
		.optional()
		.trim()
		.isLength({ max: 1000 })
		.withMessage('Task description cannot exceed 1000 characters'),
	body('priority')
		.isIn(['high', 'medium', 'low'])
		.withMessage('Priority must be high, medium, or low'),
	body('projectId')
		.notEmpty()
		.withMessage('Project ID is required')
		.isMongoId()
		.withMessage('Invalid project ID format'),
	handleValidationErrors
]

export const validateUpdateTask = [
	body('title')
		.optional()
		.trim()
		.notEmpty()
		.withMessage('Task title cannot be empty')
		.isLength({ max: 200 })
		.withMessage('Task title cannot exceed 200 characters'),
	body('description')
		.optional()
		.trim()
		.isLength({ max: 1000 })
		.withMessage('Task description cannot exceed 1000 characters'),
	body('priority')
		.optional()
		.isIn(['high', 'medium', 'low'])
		.withMessage('Priority must be high, medium, or low'),
	body('completed')
		.optional()
		.isBoolean()
		.withMessage('Completed must be a boolean'),
	handleValidationErrors
]

export const validateObjectId = [
	param('id').isMongoId().withMessage('Invalid ID format'),
	handleValidationErrors
]

export const validateProjectId = [
	param('projectId').isMongoId().withMessage('Invalid project ID format'),
	handleValidationErrors
]

export const validateBulkUpdate = [
	body('taskIds')
		.isArray({ min: 1 })
		.withMessage('Task IDs array is required and must not be empty'),
	body('taskIds.*')
		.isMongoId()
		.withMessage('Each task ID must be a valid MongoDB ObjectId'),
	body('updates').isObject().withMessage('Updates object is required'),
	handleValidationErrors
]
