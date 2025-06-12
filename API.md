# 📚 Документация Todo API

## 🌐 Базовый URL

```
http://localhost:5001/api
```

## 🔑 Аутентификация

Все API эндпоинты требуют аутентификации через Telegram Mini App. Каждый запрос должен содержать заголовок `x-telegram-init-data` с данными инициализации Telegram Web App.

```typescript
interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
}
```

Сервер проверяет подпись данных Telegram с помощью токена бота для обеспечения подлинности запроса.

## 🚦 Ограничение запросов

- **Окно**: 15 минут
- **Максимум запросов**: 100 на IP
- **Код статуса**: 429 Too Many Requests

## 🏗 Общие паттерны

### Формат ответа

**Успешный ответ:**

```typescript
interface SuccessResponse<T> {
	success: true
	data: T
	message?: string
}
```

**Ответ с ошибкой:**

```typescript
interface ErrorResponse {
	success: false
	error: string
	details?: any
}
```

### Пагинация

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

## 📁 API Проектов

### Получение списка проектов

```http
GET /projects
```

**Параметры запроса:**

| Параметр | Тип    | Описание          | Обязательный |
| -------- | ------ | ----------------- | ------------ |
| page     | number | Номер страницы    | Нет          |
| limit    | number | Элементов на стр. | Нет          |

**Ответ:** `SuccessResponse<PaginatedResponse<IProject>>`

### Получение деталей проекта

```http
GET /projects/{projectId}
```

**Ответ:** `SuccessResponse<IProject>`

### Создание проекта

```http
POST /projects
```

**Тело запроса:** `CreateProjectDto`

```typescript
interface CreateProjectDto {
	name: string // макс. 100 символов
	description: string // макс. 500 символов
}
```

**Ответ:** `SuccessResponse<IProject>`

### Обновление проекта

```http
PUT /projects/{projectId}
```

**Тело запроса:** `UpdateProjectDto`

```typescript
interface UpdateProjectDto {
	name?: string
	description?: string
}
```

**Ответ:** `SuccessResponse<IProject>`

### Удаление проекта

```http
DELETE /projects/{projectId}
```

**Ответ:** `SuccessResponse<void>`

### Статистика проекта

```http
GET /projects/{projectId}/stats
```

**Ответ:**

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

## ✅ API Задач

### Получение задач проекта

```http
GET /projects/{projectId}/tasks
```

**Параметры запроса:**

| Параметр  | Тип     | Описание              | По умолчанию |
| --------- | ------- | --------------------- | ------------ |
| completed | boolean | Фильтр по статусу     | -            |
| priority  | string  | Фильтр по приоритету  | -            |
| sort      | string  | Сортировка            | createdAt    |
| page      | number  | Номер страницы        | 1            |
| limit     | number  | Элементов на странице | 10           |

**Ответ:** `SuccessResponse<PaginatedResponse<ITask>>`

### Получение деталей задачи

```http
GET /tasks/{taskId}
```

**Ответ:** `SuccessResponse<ITask>`

### Создание задачи

```http
POST /tasks
```

**Тело запроса:** `CreateTaskDto`

```typescript
interface CreateTaskDto {
	title: string // макс. 200 символов
	description?: string // макс. 1000 символов
	priority: 'high' | 'medium' | 'low'
	projectId: string
}
```

**Ответ:** `SuccessResponse<ITask>`

### Обновление задачи

```http
PUT /tasks/{taskId}
```

**Тело запроса:** `UpdateTaskDto`

```typescript
interface UpdateTaskDto {
	title?: string
	description?: string
	priority?: 'high' | 'medium' | 'low'
	completed?: boolean
}
```

**Ответ:** `SuccessResponse<ITask>`

### Переключение статуса задачи

```http
PATCH /tasks/{taskId}/toggle
```

**Ответ:** `SuccessResponse<ITask>`

### Удаление задачи

```http
DELETE /tasks/{taskId}
```

**Ответ:** `SuccessResponse<void>`

### Массовое обновление задач

```http
PATCH /tasks/bulk
```

**Тело запроса:**

```typescript
interface BulkUpdateTasksDto {
	taskIds: string[]
	updates: {
		completed?: boolean
		priority?: 'high' | 'medium' | 'low'
	}
}
```

**Ответ:** `SuccessResponse<{ modifiedCount: number }>`

## 🔒 Безопасность

### Аутентификация Telegram

```typescript
// Middleware для проверки данных Telegram
const validateTelegramWebAppData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const initData = req.headers['x-telegram-init-data']
	// Проверяет подпись данных Telegram
	// Извлекает информацию о пользователе
	// Прикрепляет пользователя к запросу
}
```

### Настройка CORS

```typescript
const corsOptions = {
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization', 'x-telegram-init-data']
}
```

### HTTP Заголовки (Helmet)

```typescript
const helmetOptions = {
	contentSecurityPolicy:
		process.env.NODE_ENV === 'development' ? false : undefined,
	crossOriginEmbedderPolicy: false
}
```

## 📊 Коды статусов

| Код | Описание               |
| --- | ---------------------- |
| 200 | Успех - GET/PUT/PATCH  |
| 201 | Создано - POST         |
| 400 | Неверный запрос        |
| 401 | Не авторизован         |
| 403 | Запрещено              |
| 404 | Не найдено             |
| 429 | Слишком много запросов |
| 500 | Ошибка сервера         |

## 📋 Модели данных

### Модель проекта

```typescript
interface IProject extends Document {
	_id: string
	name: string
	description: string
	tasks?: ITask[] // Виртуальное поле
	createdAt: Date
	updatedAt: Date
}
```

### Модель задачи

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

## 🔄 Сервисный слой

### Базовый сервис

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

## 🧪 Тестирование

### Пример тестового запроса

```typescript
const response = await request(app).post('/api/projects').send({
	name: 'Тестовый проект',
	description: 'Тестовое описание'
})

expect(response.status).toBe(201)
expect(response.body.success).toBe(true)
```
