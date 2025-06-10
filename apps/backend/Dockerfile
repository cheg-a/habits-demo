# Этап сборки
FROM node:20-alpine AS build

# Установка pnpm
RUN npm install -g pnpm

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json и pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование кода приложения
COPY apps/backend/ ./apps/backend/

# Компиляция TypeScript
WORKDIR /app/apps/backend
RUN pnpm build

# Этап запуска
FROM node:20-alpine

# Установка pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копирование package.json и необходимых зависимостей
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/backend/package.json ./apps/backend/
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

# Установка только production зависимостей
RUN pnpm install --frozen-lockfile --prod

# Копирование .env.example в .env по умолчанию (можно переопределить в docker-compose)
# COPY apps/backend/.env.example ./apps/backend/.env

# Копирование скрипта запуска и настройка прав
# COPY apps/backend/docker-entrypoint.sh ./apps/backend/
# RUN chmod +x ./apps/backend/docker-entrypoint.sh

WORKDIR /app/apps/backend

# Пробрасываем порт, который использует приложение
EXPOSE 3000

# Использование entry-point для запуска миграций перед стартом приложения
# ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
