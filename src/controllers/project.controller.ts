import type { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import Project from '../models/Project'
import Task from '../models/Task'
import type { CreateProjectDto, UpdateProjectDto } from '../types/project.types'

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
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

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(async (req: Request, res: Response) => {
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

// @desc    Create new project
// @route   POST /api/projects
// @access  Public
export const createProject = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, description, userId }: CreateProjectDto = req.body

		const project = await Project.create({
			name,
			description,
			userId
		})

		res.status(201).json({
			success: true,
			data: project
		})
	}
)

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Public
export const updateProject = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, description }: UpdateProjectDto = req.body

		let project = await Project.findById(req.params.id)

		if (!project) {
			return res.status(404).json({
				success: false,
				error: 'Project not found'
			})
		}

		project = await Project.findByIdAndUpdate(
			req.params.id,
			{ name, description },
			{
				new: true,
				runValidators: true
			}
		)

		res.status(200).json({
			success: true,
			data: project
		})
	}
)

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Public
export const deleteProject = asyncHandler(
	async (req: Request, res: Response) => {
		const project = await Project.findById(req.params.id)

		if (!project) {
			return res.status(404).json({
				success: false,
				error: 'Project not found'
			})
		}

		// Delete all tasks associated with this project
		await Task.deleteMany({ projectId: req.params.id })

		// Delete the project
		await Project.findByIdAndDelete(req.params.id)

		res.status(200).json({
			success: true,
			data: {},
			message: 'Project and associated tasks deleted successfully'
		})
	}
)

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Public
export const getProjectStats = asyncHandler(
	async (req: Request, res: Response) => {
		const project = await Project.findById(req.params.id)

		if (!project) {
			return res.status(404).json({
				success: false,
				error: 'Project not found'
			})
		}

		const totalTasks = await Task.countDocuments({ projectId: req.params.id })
		const completedTasks = await Task.countDocuments({
			projectId: req.params.id,
			completed: true
		})
		const pendingTasks = totalTasks - completedTasks

		const tasksByPriority = await Task.aggregate([
			{ $match: { projectId: project._id } },
			{ $group: { _id: '$priority', count: { $sum: 1 } } }
		])

		const stats = {
			totalTasks,
			completedTasks,
			pendingTasks,
			completionRate:
				totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
			tasksByPriority: tasksByPriority.reduce((acc, item) => {
				acc[item._id] = item.count
				return acc
			}, {} as Record<string, number>)
		}

		res.status(200).json({
			success: true,
			data: {
				project,
				stats
			}
		})
	}
)
