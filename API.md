# Todo API Documentation

## Base URL

```
http://localhost:5001/api
```

## Проекты (Projects)

### Получить все проекты

```http
GET /projects?userId={userId}
```

**Query Parameters:**

- `userId` (required): ID пользователя

**Response:**

```json
{
	"success": true,
	"count": 2,
	"data": [
		{
			"_id": "project_id",
			"name": "Проект 1",
			"description": "Описание проекта",
			"userId": "user_id",
			"createdAt": "2024-03-10T08:00:00.000Z",
			"updatedAt": "2024-03-10T08:00:00.000Z"
		}
	]
}
```

### Получить один проект

```http
GET /projects/{projectId}
```

**Response:**

```json
{
	"success": true,
	"data": {
		"_id": "project_id",
		"name": "Проект 1",
		"description": "Описание проекта",
		"userId": "user_id",
		"createdAt": "2024-03-10T08:00:00.000Z",
		"updatedAt": "2024-03-10T08:00:00.000Z"
	}
}
```

### Создать проект

```http
POST /projects
```

**Request Body:**

```json
{
	"name": "Новый проект",
	"description": "Описание проекта",
	"userId": "user_id"
}
```

**Валидация:**

- `name`: обязательное, максимум 100 символов
- `description`: обязательное, максимум 500 символов
- `userId`: обязательное

### Обновить проект

```http
PUT /projects/{projectId}
```

**Request Body:**

```json
{
	"name": "Обновленное название",
	"description": "Обновленное описание"
}
```

### Удалить проект

```http
DELETE /projects/{projectId}
```

### Получить статистику проекта

```http
GET /projects/{projectId}/stats
```

**Response:**

```json
{
	"success": true,
	"data": {
		"project": {
			"_id": "project_id",
			"name": "Проект 1",
			"description": "Описание"
		},
		"stats": {
			"totalTasks": 10,
			"completedTasks": 5,
			"pendingTasks": 5,
			"completionRate": 50,
			"tasksByPriority": {
				"high": 2,
				"medium": 5,
				"low": 3
			}
		}
	}
}
```

## Задачи (Tasks)

### Получить задачи проекта

```http
GET /projects/{projectId}/tasks
```

**Query Parameters:**

- `completed` (optional): фильтр по статусу завершения (true/false)
- `priority` (optional): фильтр по приоритету (high/medium/low)
- `sort` (optional): сортировка (priority/completed/title)

**Response:**

```json
{
	"success": true,
	"count": 2,
	"data": [
		{
			"_id": "task_id",
			"title": "Задача 1",
			"description": "Описание задачи",
			"priority": "high",
			"completed": false,
			"projectId": "project_id",
			"createdAt": "2024-03-10T08:00:00.000Z",
			"updatedAt": "2024-03-10T08:00:00.000Z"
		}
	]
}
```

### Получить одну задачу

```http
GET /tasks/{taskId}
```

### Создать задачу

```http
POST /tasks
```

**Request Body:**

```json
{
	"title": "Новая задача",
	"description": "Описание задачи",
	"priority": "medium",
	"projectId": "project_id"
}
```

**Валидация:**

- `title`: обязательное, максимум 200 символов
- `description`: опциональное, максимум 1000 символов
- `priority`: обязательное, одно из: high/medium/low
- `projectId`: обязательное, должен существовать

### Обновить задачу

```http
PUT /tasks/{taskId}
```

**Request Body:**

```json
{
	"title": "Обновленное название",
	"description": "Обновленное описание",
	"priority": "high",
	"completed": true
}
```

### Переключить статус задачи

```http
PATCH /tasks/{taskId}/toggle
```

### Удалить задачу

```http
DELETE /tasks/{taskId}
```

### Массовое обновление задач

```http
PATCH /tasks/bulk
```

**Request Body:**

```json
{
	"taskIds": ["task_id1", "task_id2"],
	"updates": {
		"completed": true,
		"priority": "high"
	}
}
```

## Ограничения и безопасность

1. Rate Limiting: 100 запросов за 15 минут с одного IP
2. CORS: разрешены запросы только с `http://localhost:3000` (или из `FRONTEND_URL`)
3. Все ответы содержат поле `success` для быстрой проверки результата
4. При ошибках возвращается объект с полями:
   ```json
   {
   	"success": false,
   	"error": "Описание ошибки"
   }
   ```

## Коды ответов

- 200: Успешный запрос
- 201: Успешное создание
- 400: Ошибка в запросе
- 404: Ресурс не найден
- 429: Превышен лимит запросов
- 500: Внутренняя ошибка сервера

## Типы данных

### Project

```typescript
interface IProject {
	_id: string
	name: string
	description: string
	userId: string
	createdAt: Date
	updatedAt: Date
}
```

### Task

```typescript
interface ITask {
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
