export interface ITask {
	_id?: string
	title: string
	description?: string
	priority: 'high' | 'medium' | 'low'
	completed: boolean
	projectId: string
	createdAt?: Date
	updatedAt?: Date
}

export interface CreateTaskDto {
	title: string
	description?: string
	priority: 'high' | 'medium' | 'low'
	projectId: string
}

export interface UpdateTaskDto {
	title?: string
	description?: string
	priority?: 'high' | 'medium' | 'low'
	completed?: boolean
}

export interface TaskResponse {
	success: boolean
	data: ITask
}

export interface TasksResponse {
	success: boolean
	count: number
	data: ITask[]
}

export interface BulkUpdateTasksDto {
	taskIds: string[]
	updates: Partial<UpdateTaskDto>
}
