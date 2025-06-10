import express from 'express'
import {
	bulkUpdateTasks,
	createTask,
	deleteTask,
	getTask,
	toggleTask,
	updateTask
} from '../controllers/task.controller.js'
import {
	validateBulkUpdate,
	validateObjectId,
	validateTask,
	validateUpdateTask
} from '../middleware/validation.js'

const router = express.Router()

// Task routes
router.route('/').post([validateTask, createTask] as express.RequestHandler[])

router
	.route('/bulk')
	.patch([validateBulkUpdate, bulkUpdateTasks] as express.RequestHandler[])

router
	.route('/:id')
	.get([validateObjectId, getTask] as express.RequestHandler[])
	.put([
		validateObjectId,
		validateUpdateTask,
		updateTask
	] as express.RequestHandler[])
	.delete([validateObjectId, deleteTask] as express.RequestHandler[])

router.patch('/:id/toggle', [
	validateObjectId,
	toggleTask
] as express.RequestHandler[])

export default router
