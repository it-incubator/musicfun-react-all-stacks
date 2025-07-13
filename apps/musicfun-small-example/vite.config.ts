import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tanstackRouter from '@tanstack/router-plugin/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      // “@” will map to the /src directory
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
})
