import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // Доступ к любой переменной
  const VITE_APP_BASE_URL = env.VITE_APP_BASE_URL

  console.log('✅ mode: ' + mode)
  console.log('✅ VITE_APP_BASE_URL: ' + VITE_APP_BASE_URL)

  return {
    plugins: [react()],
    base: '/' + VITE_APP_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: true, // ← or '0.0.0.0'
      port: 5174,
      strictPort: true,
      allowedHosts: [
        'domain.prod', // <-- your custom host
        'localhost', // (optional) keep localhost too
      ],
    },
  }
})
