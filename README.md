# Todo Telegram Backend

Backend API для управления задачами и проектами. Построен с использованием Express.js и MongoDB.

## Технологии

- Node.js
- Express.js
- MongoDB + Mongoose
- TypeScript
- Express Validator
- Rate Limiting
- CORS
- Helmet для безопасности

## Требования

- Node.js >= 18
- MongoDB
- npm или yarn

## Установка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd todo-telegram-backend
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в корневой директории:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/todo-telegram
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Запуск

### Разработка

```bash
npm run dev
```

### Продакшн

```bash
npm run build
npm start
```

## Основные функции

### Проекты

- Создание, чтение, обновление и удаление проектов
- Фильтрация проектов по пользователю
- Статистика по задачам в проекте

### Задачи

- CRUD операции для задач
- Фильтрация по статусу и приоритету
- Массовое обновление задач
- Переключение статуса выполнения

## API Документация

Подробная документация API доступна в файле [API.md](API.md).

## Безопасность

- Rate limiting: 100 запросов за 15 минут
- CORS защита
- HTTP Security Headers (Helmet)
- Валидация входных данных
- Безопасные MongoDB запросы

## Структура проекта

```
src/
├── controllers/     # Обработчики запросов
├── middleware/      # Middleware функции
├── models/         # Mongoose модели
├── routes/         # Маршруты API
├── types/          # TypeScript типы
├── utils/          # Вспомогательные функции
└── server.ts       # Точка входа
```

## Разработка

### Линтинг

```bash
npm run lint
```

### Тесты

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Лицензия

ISC
