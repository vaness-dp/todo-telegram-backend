import express from 'express'
import {
	createProject,
	deleteProject,
	getProject,
	getProjects,
	getProjectStats,
	updateProject
} from '../controllers/project.controller.js'
import { getTasks } from '../controllers/task.controller.js'
import {
	validateObjectId,
	validateProject,
	validateProjectId,
	validateUpdateProject
} from '../middleware/validation.js'

const router = express.Router()

// Project routes
router
	.route('/')
	.get(getProjects as express.RequestHandler)
	.post([validateProject, createProject] as express.RequestHandler[])

router
	.route('/:id')
	.get([validateObjectId, getProject] as express.RequestHandler[])
	.put([
		validateObjectId,
		validateUpdateProject,
		updateProject
	] as express.RequestHandler[])
	.delete([validateObjectId, deleteProject] as express.RequestHandler[])

// Project statistics
router.get('/:id/stats', [
	validateObjectId,
	getProjectStats
] as express.RequestHandler[])

// Tasks within a project
router.get('/:projectId/tasks', [
	validateProjectId,
	getTasks
] as express.RequestHandler[])

export default router
