import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    host: true, // ← or '0.0.0.0'
    port: 5175,
    strictPort: true,
    allowedHosts: [
      'domain.prod', // <-- your custom host
      'localhost', // (optional) keep localhost too
    ],
  },
})
