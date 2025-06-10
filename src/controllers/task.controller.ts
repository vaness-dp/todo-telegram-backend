import type { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import Project from '../models/Project'
import Task from '../models/Task'
import type { CreateTaskDto, UpdateTaskDto } from '../types/task.types'

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Public
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
	const { projectId } = req.params
	const { completed, priority, sort } = req.query

	// Check if project exists
	const project = await Project.findById(projectId)
	if (!project) {
		return res.status(404).json({
			success: false,
			error: 'Project not found'
		})
	}

	// Build filter object
	const filter: any = { projectId }

	if (completed !== undefined) {
		filter.completed = completed === 'true'
	}

	if (priority) {
		filter.priority = priority
	}

	// Build sort object
	let sortOption: any = { createdAt: -1 } // Default sort

	if (sort === 'priority') {
		// Custom priority sort: high -> medium -> low
		sortOption = {
			priority: { $in: ['high', 'medium', 'low'] },
			createdAt: -1
		}
	} else if (sort === 'completed') {
		sortOption = { completed: 1, createdAt: -1 }
	} else if (sort === 'title') {
		sortOption = { title: 1 }
	}

	const tasks = await Task.find(filter).sort(sortOption)

	res.status(200).json({
		success: true,
		count: tasks.length,
		data: tasks
	})
})

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
export const getTask = asyncHandler(async (req: Request, res: Response) => {
	const task = await Task.findById(req.params.id).populate('projectId', 'name')

	if (!task) {
		return res.status(404).json({
			success: false,
			error: 'Task not found'
		})
	}

	res.status(200).json({
		success: true,
		data: task
	})
})

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
export const createTask = asyncHandler(async (req: Request, res: Response) => {
	const { title, description, priority, projectId }: CreateTaskDto = req.body

	// Check if project exists
	const project = await Project.findById(projectId)
	if (!project) {
		return res.status(404).json({
			success: false,
			error: 'Project not found'
		})
	}

	const task = await Task.create({
		title,
		description,
		priority,
		projectId,
		completed: false
	})

	res.status(201).json({
		success: true,
		data: task
	})
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
	const { title, description, priority, completed }: UpdateTaskDto = req.body

	let task = await Task.findById(req.params.id)

	if (!task) {
		return res.status(404).json({
			success: false,
			error: 'Task not found'
		})
	}

	task = await Task.findByIdAndUpdate(
		req.params.id,
		{ title, description, priority, completed },
		{
			new: true,
			runValidators: true
		}
	)

	res.status(200).json({
		success: true,
		data: task
	})
})

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Public
export const toggleTask = asyncHandler(async (req: Request, res: Response) => {
	let task = await Task.findById(req.params.id)

	if (!task) {
		return res.status(404).json({
			success: false,
			error: 'Task not found'
		})
	}

	task = await Task.findByIdAndUpdate(
		req.params.id,
		{ completed: !task.completed },
		{ new: true, runValidators: true }
	)

	res.status(200).json({
		success: true,
		data: task,
		message: `Task marked as ${task!.completed ? 'completed' : 'pending'}`
	})
})

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
	const task = await Task.findById(req.params.id)

	if (!task) {
		return res.status(404).json({
			success: false,
			error: 'Task not found'
		})
	}

	await Task.findByIdAndDelete(req.params.id)

	res.status(200).json({
		success: true,
		data: {},
		message: 'Task deleted successfully'
	})
})

// @desc    Bulk update tasks
// @route   PATCH /api/tasks/bulk
// @access  Public
export const bulkUpdateTasks = asyncHandler(
	async (req: Request, res: Response) => {
		const { taskIds, updates } = req.body

		if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
			return res.status(400).json({
				success: false,
				error: 'Task IDs array is required'
			})
		}

		const result = await Task.updateMany({ _id: { $in: taskIds } }, updates, {
			runValidators: true
		})

		res.status(200).json({
			success: true,
			data: {
				modifiedCount: result.modifiedCount,
				matchedCount: result.matchedCount
			},
			message: `${result.modifiedCount} tasks updated successfully`
		})
	}
)
