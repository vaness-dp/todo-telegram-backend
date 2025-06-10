export interface IProject {
	_id?: string
	name: string
	description: string
	userId: string
	createdAt?: Date
	updatedAt?: Date
}

export interface CreateProjectDto {
	name: string
	description: string
	userId: string
}

export interface UpdateProjectDto {
	name?: string
	description?: string
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
