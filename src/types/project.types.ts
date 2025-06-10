import { Document } from 'mongoose'

/**
 * Project document interface
 */
export interface IProject extends Document {
	_id?: string
	name: string
	description: string
	userId: string
	tasks?: string[]
	createdAt: Date
	updatedAt: Date
}

/**
 * Data transfer object for creating a project
 */
export interface CreateProjectDto {
	name: string
	description: string
	userId: string
}

/**
 * Data transfer object for updating a project
 */
export interface UpdateProjectDto {
	name?: string
	description?: string
}

/**
 * Project statistics interface
 */
export interface ProjectStats {
	total: number
	completed: number
	high: number
	medium: number
	low: number
}

/**
 * Project response with pagination
 */
export interface PaginatedProjectsResponse {
	items: IProject[]
	pagination: {
		total: number
		page: number
		pages: number
	}
}

export interface ProjectResponse {
	success: boolean
	data: IProject
}

export interface ProjectsResponse {
	success: boolean
	count: number
	data: IProject[]
}
