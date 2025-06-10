export class HttpError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public details?: any
	) {
		super(message)
		this.name = 'HttpError'
	}
}

export class ValidationError extends HttpError {
	constructor(details: any) {
		super(400, 'Validation Error', details)
		this.name = 'ValidationError'
	}
}

export class AuthorizationError extends HttpError {
	constructor(message = 'Not authorized') {
		super(401, message)
		this.name = 'AuthorizationError'
	}
}

export class ForbiddenError extends HttpError {
	constructor(message = 'Access forbidden') {
		super(403, message)
		this.name = 'ForbiddenError'
	}
}

export class NotFoundError extends HttpError {
	constructor(resource = 'Resource') {
		super(404, `${resource} not found`)
		this.name = 'NotFoundError'
	}
}
