# 📚 Todo API Documentation

## 🌐 Base URL

```
http://localhost:5001/api
```

## 🔑 Authentication

> ⚠️ Currently using simple userId-based authentication. JWT implementation planned for future releases.

## 🚦 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Status Code**: 429 Too Many Requests

## 🏗 Common Patterns

### Response Format

**Success Response:**

```typescript
interface SuccessResponse<T> {
	success: true
	data: T
	message?: string
}
```

**Error Response:**

```typescript
interface ErrorResponse {
	success: false
	error: string
	details?: any
}
```

### Pagination

```typescript
interface PaginatedResponse<T> {
	items: T[]
	pagination: {
		total: number
		page: number
		pages: number
	}
}
```

## 📁 Projects API

### Get Projects List

```http
GET /projects
```

**Query Parameters:**

| Parameter | Type   | Description    | Required |
| --------- | ------ | -------------- | -------- |
| userId    | string | Filter by user | Yes      |
| page      | number | Page number    | No       |
| limit     | number | Items per page | No       |

**Response:** `SuccessResponse<PaginatedResponse<IProject>>`

### Get Project Details

```http
GET /projects/{projectId}
```

**Response:** `SuccessResponse<IProject>`

### Create Project

```http
POST /projects
```

**Request Body:** `CreateProjectDto`

```typescript
interface CreateProjectDto {
	name: string // max 100 chars
	description: string // max 500 chars
	userId: string
}
```

**Response:** `SuccessResponse<IProject>`

### Update Project

```http
PUT /projects/{projectId}
```

**Request Body:** `UpdateProjectDto`

```typescript
interface UpdateProjectDto {
	name?: string
	description?: string
}
```

**Response:** `SuccessResponse<IProject>`

### Delete Project

```http
DELETE /projects/{projectId}
```

**Response:** `SuccessResponse<void>`

### Get Project Statistics

```http
GET /projects/{projectId}/stats
```

**Response:**

```typescript
interface ProjectStats {
	totalTasks: number
	completedTasks: number
	pendingTasks: number
	completionRate: number
	tasksByPriority: {
		high: number
		medium: number
		low: number
	}
}
```

## ✅ Tasks API

### Get Project Tasks

```http
GET /projects/{projectId}/tasks
```

**Query Parameters:**

| Parameter | Type    | Description                        | Default   |
| --------- | ------- | ---------------------------------- | --------- |
| completed | boolean | Filter by completion status        | -         |
| priority  | string  | Filter by priority                 | -         |
| sort      | string  | Sort by (priority/completed/title) | createdAt |
| page      | number  | Page number                        | 1         |
| limit     | number  | Items per page                     | 10        |

**Response:** `SuccessResponse<PaginatedResponse<ITask>>`

### Get Task Details

```http
GET /tasks/{taskId}
```

**Response:** `SuccessResponse<ITask>`

### Create Task

```http
POST /tasks
```

**Request Body:** `CreateTaskDto`

```typescript
interface CreateTaskDto {
	title: string // max 200 chars
	description?: string // max 1000 chars
	priority: 'high' | 'medium' | 'low'
	projectId: string
}
```

**Response:** `SuccessResponse<ITask>`

### Update Task

```http
PUT /tasks/{taskId}
```

**Request Body:** `UpdateTaskDto`

```typescript
interface UpdateTaskDto {
	title?: string
	description?: string
	priority?: 'high' | 'medium' | 'low'
	completed?: boolean
}
```

**Response:** `SuccessResponse<ITask>`

### Toggle Task Status

```http
PATCH /tasks/{taskId}/toggle
```

**Response:** `SuccessResponse<ITask>`

### Delete Task

```http
DELETE /tasks/{taskId}
```

**Response:** `SuccessResponse<void>`

### Bulk Update Tasks

```http
PATCH /tasks/bulk
```

**Request Body:**

```typescript
interface BulkUpdateTasksDto {
	taskIds: string[]
	updates: {
		completed?: boolean
		priority?: 'high' | 'medium' | 'low'
	}
}
```

**Response:** `SuccessResponse<{ modifiedCount: number }>`

## 🔒 Security

### CORS Configuration

```typescript
const corsOptions = {
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true
}
```

### HTTP Headers (Helmet)

```typescript
const helmetOptions = {
	contentSecurityPolicy:
		process.env.NODE_ENV === 'development' ? false : undefined
}
```

## 📊 Status Codes

| Code | Description             |
| ---- | ----------------------- |
| 200  | Success - GET/PUT/PATCH |
| 201  | Created - POST          |
| 400  | Bad Request             |
| 401  | Unauthorized            |
| 403  | Forbidden               |
| 404  | Not Found               |
| 429  | Too Many Requests       |
| 500  | Server Error            |

## 📋 Data Models

### Project Model

```typescript
interface IProject extends Document {
	_id: string
	name: string
	description: string
	userId: string
	tasks?: ITask[] // Virtual
	createdAt: Date
	updatedAt: Date
}
```

### Task Model

```typescript
interface ITask extends Document {
	_id: string
	title: string
	description?: string
	priority: 'high' | 'medium' | 'low'
	completed: boolean
	projectId: string
	createdAt: Date
	updatedAt: Date
}
```

## 🔄 Service Layer

### Base Service

```typescript
class BaseService<T extends Document> {
	async findById(id: string): Promise<T>
	async create(data: Partial<T>): Promise<T>
	async update(id: string, data: Partial<T>): Promise<T>
	async delete(id: string): Promise<void>
	async findWithPagination(
		query: any,
		page?: number,
		limit?: number
	): Promise<PaginatedResponse<T>>
}
```

## 🧪 Testing

### Example Test Request

```typescript
const response = await request(app).post('/api/projects').send({
	name: 'Test Project',
	description: 'Test Description',
	userId: 'test-user-id'
})

expect(response.status).toBe(201)
expect(response.body.success).toBe(true)
```
