import mongoose, { Document, Schema } from 'mongoose'
import type { ITask } from '../types/task.types'

export interface TaskDocument extends Omit<ITask, '_id'>, Document {}

const TaskSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Task title is required'],
			trim: true,
			maxlength: [200, 'Task title cannot exceed 200 characters']
		},
		description: {
			type: String,
			trim: true,
			maxlength: [1000, 'Task description cannot exceed 1000 characters']
		},
		priority: {
			type: String,
			enum: ['high', 'medium', 'low'],
			default: 'medium',
			required: true
		},
		completed: {
			type: Boolean,
			default: false
		},
		projectId: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: [true, 'Project ID is required'],
			index: true
		}
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
)

// Index for better query performance
TaskSchema.index({ projectId: 1, createdAt: -1 })
TaskSchema.index({ projectId: 1, completed: 1 })

export default mongoose.model<TaskDocument>('Task', TaskSchema)
