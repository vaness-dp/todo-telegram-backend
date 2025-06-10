import { Document, Model } from 'mongoose'
import { HttpError } from '../utils/errors'

export class BaseService<T extends Document> {
	constructor(protected readonly model: Model<T>) {}

	/**
	 * Find a document by ID
	 * @param id - Document ID
	 * @throws {HttpError} - If document not found
	 */
	async findById(id: string): Promise<T> {
		const doc = await this.model.findById(id)
		if (!doc) {
			throw new HttpError(404, 'Document not found')
		}
		return doc
	}

	/**
	 * Create a new document
	 * @param data - Document data
	 */
	async create(data: Partial<T>): Promise<T> {
		return this.model.create(data)
	}

	/**
	 * Update a document by ID
	 * @param id - Document ID
	 * @param data - Update data
	 * @throws {HttpError} - If document not found
	 */
	async update(id: string, data: Partial<T>): Promise<T> {
		const doc = await this.model.findByIdAndUpdate(id, data, { new: true })
		if (!doc) {
			throw new HttpError(404, 'Document not found')
		}
		return doc
	}

	/**
	 * Delete a document by ID
	 * @param id - Document ID
	 * @throws {HttpError} - If document not found
	 */
	async delete(id: string): Promise<void> {
		const doc = await this.model.findByIdAndDelete(id)
		if (!doc) {
			throw new HttpError(404, 'Document not found')
		}
	}

	/**
	 * Find documents with pagination
	 * @param query - Query filter
	 * @param page - Page number
	 * @param limit - Items per page
	 */
	async findWithPagination(query: any = {}, page = 1, limit = 10) {
		const skip = (page - 1) * limit
		const [items, total] = await Promise.all([
			this.model.find(query).skip(skip).limit(limit),
			this.model.countDocuments(query)
		])

		return {
			items,
			pagination: {
				total,
				page,
				pages: Math.ceil(total / limit)
			}
		}
	}
}
