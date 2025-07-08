import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tanstackRouter from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
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
