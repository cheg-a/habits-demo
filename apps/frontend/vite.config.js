import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/<repository-name>/',
  plugins: [react()],
  server: {
    allowedHosts: ['habbit.local'], // Добавляем разрешенные хосты
    proxy: {
      '/api': {
        target: 'http://api.habbit.local:3000', // URL вашего бэкенда
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Удаляем /api из пути
      },
    },
  },
})
