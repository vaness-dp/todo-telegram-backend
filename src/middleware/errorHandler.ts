import type { NextFunction, Request, Response } from 'express'

export interface AppError extends Error {
	statusCode?: number
	isOperational?: boolean
}

export const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let error = { ...err }
	error.message = err.message

	// Log error
	console.error(err)

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = 'Resource not found'
		error = { name: 'CastError', message, statusCode: 404 } as AppError
	}

	// Mongoose duplicate key
	if (err.name === 'MongoError' && (err as any).code === 11000) {
		const message = 'Duplicate field value entered'
		error = { name: 'MongoError', message, statusCode: 400 } as AppError
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values((err as any).errors)
			.map((val: any) => val.message)
			.join(', ')
		error = { name: 'ValidationError', message, statusCode: 400 } as AppError
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	})
}

// AsyncHandler wrapper для обработки async/await ошибок
export const asyncHandler =
	(fn: Function) => (req: Request, res: Response, next: NextFunction) =>
		Promise.resolve(fn(req, res, next)).catch(next)
