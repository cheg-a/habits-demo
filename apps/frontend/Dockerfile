# Этап сборки
FROM node:20-alpine AS build

# Установка pnpm
RUN npm install -g pnpm

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json и pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ ./packages/

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование кода приложения
COPY apps/frontend/ ./apps/frontend/

# Создание production сборки
WORKDIR /app/apps/frontend
RUN pnpm build

# Этап запуска
FROM nginx:alpine

# Копирование статических файлов из этапа сборки
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

# Настройка конфигурации Nginx
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
