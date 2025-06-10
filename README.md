# Todo Telegram Backend

Масштабируемый REST API для управления задачами и проектами. Построен с использованием Express.js, TypeScript и MongoDB.

## 🚀 Особенности

- **Типизация**: Полная поддержка TypeScript
- **Масштабируемость**: Модульная архитектура с базовыми классами
- **Безопасность**: CORS, Rate Limiting, Helmet
- **Документация**: Подробное API с примерами и типами
- **Валидация**: Строгая валидация входных данных
- **Мониторинг**: Встроенные health-checks и статистика

## 🛠 Технологии

- **Runtime**: Node.js (>= 18)
- **Framework**: Express.js
- **Database**: MongoDB с Mongoose
- **Language**: TypeScript
- **Security**:
  - Helmet (HTTP headers)
  - CORS protection
  - Rate limiting
  - Input validation
- **Development**:
  - ESLint
  - Prettier
  - Nodemon

## 📦 Установка

1. **Клонирование**:

```bash
git clone <repository-url>
cd todo-telegram-backend
```

2. **Зависимости**:

```bash
npm install
```

3. **Конфигурация**:
   Создайте `.env` файл:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/todo-telegram

# Security
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100
```

## 🚀 Запуск

### Разработка

```bash
npm run dev
```

### Продакшн

```bash
npm run build
npm start
```

## 📁 Структура проекта

```
src/
├── config/         # Конфигурация приложения
├── controllers/    # Обработчики запросов
├── middleware/     # Middleware функции
├── models/        # Mongoose модели
├── routes/        # Маршруты API
├── services/      # Бизнес-логика
├── types/         # TypeScript типы
├── utils/         # Утилиты
└── server.ts      # Точка входа
```

## 🔑 Основные концепции

### Архитектура

- **Service Layer Pattern**: Бизнес-логика инкапсулирована в сервисах
- **Base Service**: Общая CRUD функциональность в базовом классе
- **Repository Pattern**: Работа с БД через модели
- **DTO Pattern**: Строгая типизация входных/выходных данных

### Безопасность

- Rate limiting: 100 запросов/15 минут
- CORS с настраиваемым origin
- HTTP Security Headers
- Валидация всех входных данных
- Безопасные MongoDB запросы

## 📚 API Документация

Подробная документация доступна в [API.md](API.md).

### Основные эндпоинты:

- `GET /health` - Проверка состояния сервера
- `GET /api/projects` - Получение проектов
- `GET /api/tasks` - Получение задач

## 🧪 Разработка

### Линтинг

```bash
npm run lint
npm run lint:fix
```

### Форматирование

```bash
npm run format
```

### Тесты

```bash
npm test
npm run test:coverage
```

## 🤝 Contributing

1. Fork репозитория
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'feat: add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Соглашения

- **Commits**: Следуем [Conventional Commits](https://www.conventionalcommits.org/)
- **Branch Names**: `feature/*`, `fix/*`, `docs/*`, etc.
- **Code Style**: ESLint + Prettier
- **Documentation**: JSDoc для всех публичных API

## 📄 Лицензия

ISC

## 🔗 Полезные ссылки

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
