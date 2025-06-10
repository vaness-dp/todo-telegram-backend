export const PRIORITY_LEVELS = {
	HIGH: 'high',
	MEDIUM: 'medium',
	LOW: 'low',
} as const

export const PRIORITY_ORDER = {
	high: 3,
	medium: 2,
	low: 1,
}

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const

export const RESPONSE_MESSAGES = {
	PROJECT_CREATED: 'Project created successfully',
	PROJECT_UPDATED: 'Project updated successfully',
	PROJECT_DELETED: 'Project deleted successfully',
	TASK_CREATED: 'Task created successfully',
	TASK_UPDATED: 'Task updated successfully',
	TASK_DELETED: 'Task deleted successfully',
	TASK_COMPLETED: 'Task marked as completed',
	TASK_PENDING: 'Task marked as pending',
} as const
