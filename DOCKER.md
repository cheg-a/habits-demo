# Инструкция по докеризации проекта habbits-mvp

Этот файл содержит инструкции по запуску проекта в Docker.

## Требования

- Docker
- Docker Compose

## Быстрый старт

1. Клонируйте репозиторий
2. Запустите проект с помощью Docker Compose:

```bash
docker compose up -d
```

3. Приложение будет доступно по адресам:
   - Фронтенд: http://localhost
   - Бэкенд API: http://localhost:3000

## Конфигурация

Для настройки параметров проекта создайте файл `.env` в корне проекта на основе примера:

```
# База данных
DB_USER=user
DB_PASSWORD=password
DB_NAME=habbitdb

# Бэкенд
SESSION_SECRET=your_super_secret_key_change_me_in_production
```

## Структура Docker

Проект состоит из трех основных сервисов:

1. **postgres** - база данных PostgreSQL
2. **backend** - Fastify API на Node.js
3. **frontend** - React приложение с Nginx

## Управление контейнерами

### Запуск всех сервисов
```
docker compose up -d
```

### Остановка всех сервисов
```
docker compose down
```

### Просмотр логов
```
docker compose logs -f
```

### Просмотр логов конкретного сервиса
```
docker compose logs -f backend
docker compose logs -f frontend
```

### Перезапуск одного сервиса
```
docker compose restart backend
```

## Данные

Данные PostgreSQL сохраняются в Docker volume `postgres-data`, 
что обеспечивает сохранность между перезапусками.

## Разработка

Для локальной разработки рекомендуется использовать команды:

```bash
# Запуск бэкенда в режиме разработки
pnpm dev:backend

# Запуск фронтенда в режиме разработки
pnpm dev:frontend
```
