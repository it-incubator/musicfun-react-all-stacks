import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rtkquery',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true, // ← or '0.0.0.0'
    port: 5176,
    strictPort: true,
    allowedHosts: [
      'domain.prod', // <-- your custom host
      'localhost', // (optional) keep localhost too
    ],
  },
})
