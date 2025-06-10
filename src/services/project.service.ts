import { Model } from 'mongoose'
import { ProjectDocument } from '../models/Project'
import { TaskDocument } from '../models/Task'
import { CreateProjectDto, UpdateProjectDto } from '../types/project.types'
import { BaseService } from '../utils/base.service'
import { HttpError } from '../utils/errors'

export class ProjectService extends BaseService<ProjectDocument> {
	constructor(model: Model<ProjectDocument>) {
		super(model)
	}

	/**
	 * Create a new project
	 * @param userId - User ID
	 * @param data - Project data
	 */
	async createProject(
		userId: string,
		data: CreateProjectDto
	): Promise<ProjectDocument> {
		return this.create({ ...data, userId })
	}

	/**
	 * Update a project
	 * @param userId - User ID
	 * @param projectId - Project ID
	 * @param data - Update data
	 */
	async updateProject(
		userId: string,
		projectId: string,
		data: UpdateProjectDto
	): Promise<ProjectDocument> {
		const project = await this.findById(projectId)

		if (project.userId.toString() !== userId) {
			throw new HttpError(403, 'Not authorized to update this project')
		}

		return this.update(projectId, data)
	}

	/**
	 * Delete a project
	 * @param userId - User ID
	 * @param projectId - Project ID
	 */
	async deleteProject(userId: string, projectId: string): Promise<void> {
		const project = await this.findById(projectId)

		if (project.userId.toString() !== userId) {
			throw new HttpError(403, 'Not authorized to delete this project')
		}

		await this.delete(projectId)
	}

	/**
	 * Get user's projects with pagination
	 * @param userId - User ID
	 * @param page - Page number
	 * @param limit - Items per page
	 */
	async getUserProjects(userId: string, page = 1, limit = 10) {
		return this.findWithPagination({ userId }, page, limit)
	}

	/**
	 * Get project statistics
	 * @param projectId - Project ID
	 */
	async getProjectStats(projectId: string) {
		const project = await this.model
			.findById(projectId)
			.populate<{ tasks: TaskDocument[] }>('tasks')
		if (!project) {
			throw new HttpError(404, 'Project not found')
		}

		const tasks = project.tasks || []
		return {
			total: tasks.length,
			completed: tasks.filter((task: TaskDocument) => task.completed).length,
			high: tasks.filter((task: TaskDocument) => task.priority === 'high')
				.length,
			medium: tasks.filter((task: TaskDocument) => task.priority === 'medium')
				.length,
			low: tasks.filter((task: TaskDocument) => task.priority === 'low').length
		}
	}
}
