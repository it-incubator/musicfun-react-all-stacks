import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6011,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 6011,
    strictPort: true,
    cors: true,
  },
  build: {
    lib: {
      entry: './src/main.tsx',
      name: 'player',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // Исключаем React из bundle - он будет загружен через Import Map
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      output: {
        // Убираем inlineDynamicImports - разрешаем code splitting
        // inlineDynamicImports: true,  ← УДАЛЕНО

        // Указываем как импортировать external модули
        paths: {
          react: 'react',
          'react-dom': 'react-dom',
          'react-dom/client': 'react-dom/client',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
