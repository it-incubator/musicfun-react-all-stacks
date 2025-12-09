import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['effector/babel-plugin'],
      },
    }),
    tsconfigPaths(),
  ],
  base: '/effector',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
