import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6010,
    strictPort: true,
  },
  preview: {
    port: 6010,
    strictPort: true,
  },
})
