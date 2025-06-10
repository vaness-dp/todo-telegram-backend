import mongoose, { Document, Schema } from 'mongoose'
import type { IProject } from '../types/project.types'

export interface ProjectDocument extends Omit<IProject, '_id'>, Document {}

const ProjectSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Project name is required'],
			trim: true,
			maxlength: [100, 'Project name cannot exceed 100 characters']
		},
		description: {
			type: String,
			required: [true, 'Project description is required'],
			trim: true,
			maxlength: [500, 'Project description cannot exceed 500 characters']
		},
		userId: {
			type: String,
			required: [true, 'User ID is required'],
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
ProjectSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model<ProjectDocument>('Project', ProjectSchema)
