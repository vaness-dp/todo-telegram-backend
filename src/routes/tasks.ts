import express from 'express'
import {
	createTask,
	deleteTask,
	getTask,
	getTasks,
	updateTask
} from '../controllers/task.controller'
import {
	validateObjectId,
	validateTask,
	validateUpdateTask
} from '../middleware/validation'

const router = express.Router()

// Task routes
router
	.route('/')
	.get(getTasks as express.RequestHandler)
	.post([validateTask, createTask] as express.RequestHandler[])

router
	.route('/:id')
	.get([validateObjectId, getTask] as express.RequestHandler[])
	.put([
		validateObjectId,
		validateUpdateTask,
		updateTask
	] as express.RequestHandler[])
	.delete([validateObjectId, deleteTask] as express.RequestHandler[])

export default router
