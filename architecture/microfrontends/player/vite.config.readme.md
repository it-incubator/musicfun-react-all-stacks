# Детальное объяснение конфигураций Vite для Player Microfrontend

Этот файл содержит подробное описание всех настроек в `vite.config.ts` для микрофронтенд приложения Player.

---

## 1. **`server.cors: true`** (строка 10)

### Что делает:

Включает Cross-Origin Resource Sharing (CORS) для dev-сервера Vite.

### Зачем нужно:

- Когда root приложение (на порту 6010) пытается загрузить модуль player (с порта 6011), браузер видит это как запрос между разными источниками (origins)
- По умолчанию браузеры блокируют такие запросы из соображений безопасности
- `cors: true` добавляет HTTP заголовки, разрешающие кросс-доменные запросы:
  - `Access-Control-Allow-Origin: *` - разрешает запросы с любого домена
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
  - `Access-Control-Allow-Headers: *`

### Пример проблемы без этого:

```
Access to fetch at 'http://localhost:6011/index.js' from origin 'http://localhost:6010'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

---

## 2. **`build.lib`** (строки 18-23)

### Что делает:

Настраивает Vite для сборки библиотеки (library mode) вместо обычного веб-приложения.

### 2.1 **`entry: './src/main.tsx'`**

- **Точка входа** для сборки библиотеки
- Vite начнет сборку с этого файла и включит все его зависимости
- В обычном режиме Vite использует `index.html` как точку входа
- В режиме библиотеки используется JavaScript/TypeScript файл

### 2.2 **`name: 'player'`**

- **Имя глобальной переменной** для библиотеки (используется для UMD/IIFE форматов)
- В нашем случае не критично, так как мы используем ES modules
- Но если бы использовали UMD формат, библиотека была бы доступна как `window.player`

### 2.3 **`formats: ['es']`**

- **Формат выходного модуля**: ES modules (ECMAScript modules)
- Альтернативы: `'umd'`, `'cjs'`, `'iife'`
- ES modules используют `import/export` синтаксис
- Это современный стандарт, который понимают все современные браузеры
- Single-SPA может динамически загружать ES модули через `import()`

**Почему ES модули:**

```javascript
// В root/src/App.tsx:
app: () => import('http://localhost:6011/index.js')
// Это работает только если index.js - ES модуль с export
```

### 2.4 **`fileName: () => 'index.js'`**

- **Имя выходного файла** после сборки
- Функция позволяет динамически генерировать имя
- В данном случае всегда возвращает `'index.js'`
- Без этого Vite создал бы файл типа `player.es.js` или `player.mjs`

**Результат:** После сборки создается `dist/index.js` - один ES модуль

---

## 3. **`rollupOptions.output.inlineDynamicImports: true`** (строка 26)

### Что делает:

Объединяет все динамические импорты в один файл вместо создания отдельных chunks.

### Без этой опции:

Vite/Rollup создал бы несколько файлов:

```
dist/
  ├── index.js (основной файл)
  ├── chunk-abc123.js (код React)
  ├── chunk-def456.js (код single-spa-react)
  └── chunk-ghi789.js (другие зависимости)
```

### С этой опцией:

```
dist/
  └── index.js (весь код в одном файле)
```

### Зачем нужно для микрофронтендов:

- Root приложение загружает только один URL: `http://localhost:6011/index.js`
- Нет необходимости отслеживать и загружать дополнительные chunk'и
- Упрощает деплой и управление версиями
- Single-SPA ожидает один модуль с экспортами `bootstrap`, `mount`, `unmount`

### Недостатки:

- Больший размер файла (326 KB вместо распределенных chunks)
- Нет возможности кешировать общие зависимости отдельно
- Для production обычно используют более сложную стратегию с Module Federation

---

## 4. **`define: { 'process.env.NODE_ENV': JSON.stringify('production') }`** (строки 30-32)

### Что делает:

Заменяет все вхождения `process.env.NODE_ENV` в коде на строку `"production"` во время сборки.

### Проблема, которую это решает:

React и многие библиотеки используют проверки:

```javascript
if (process.env.NODE_ENV !== 'production') {
  console.warn('Development warning message')
  // Дополнительные проверки для разработки
}
```

**В Node.js** `process.env.NODE_ENV` - это переменная окружения.
**В браузере** объекта `process` не существует!

### Без define:

```javascript
// В собранном index.js будет:
if (process.env.NODE_ENV !== 'production') { ... }
// ❌ Ошибка: ReferenceError: process is not defined
```

### С define:

```javascript
// Vite заменяет во время сборки:
if ("production" !== 'production') { ... }
// После минификации это условие полностью удаляется
```

### Дополнительные эффекты:

1. **Удаление debug кода:** Минификатор видит `if ("production" !== 'production')` → всегда false → удаляет весь блок
2. **Уменьшение размера:** React production сборка на ~30% меньше dev версии
3. **Производительность:** Убираются все development проверки и warnings

### Альтернативы:

```javascript
define: {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
}
// Использует реальную переменную окружения если есть
```

---

## Как все работает вместе

### Сценарий работы:

#### 1. Сборка player:

```bash
pnpm build
```

- Vite читает `src/main.tsx` (entry point)
- Собирает все зависимости в один файл (inlineDynamicImports)
- Заменяет `process.env.NODE_ENV` на `"production"`
- Создает ES модуль `dist/index.js` с экспортами `bootstrap`, `mount`, `unmount`

#### 2. Запуск preview сервера:

```bash
pnpm preview
```

- Запускает сервер на порту 6011
- Включает CORS для кросс-доменных запросов
- Отдает собранный `dist/index.js`

#### 3. Root загружает player:

```javascript
// root/src/App.tsx
registerApplication({
  name: 'appName',
  app: () => import('http://localhost:6011/index.js'),
  // ...
})
```

- Браузер делает GET запрос на `http://localhost:6011/index.js`
- CORS заголовки разрешают запрос с localhost:6010
- Загружается ES модуль
- Single-SPA вызывает `bootstrap()`, затем `mount()`
- Player рендерится в `#dashboard-root`

---

## Размер файла: почему 326 KB?

```
dist/index.js    326.16 kB │ gzip: 74.94 kB
```

### Что внутри:

- React (~130 KB) - весь runtime React
- ReactDOM (~130 KB) - код для работы с DOM
- single-spa-react (~20 KB) - адаптер для интеграции
- Ваш код App.tsx (~2 KB)
- Остальное - полифилы и runtime код

### После gzip:

74.94 KB - то, что реально передается по сети

### Оптимизация для production:

- Использовать Module Federation (Webpack) или Native Federation (Vite)
- Шарить React между микрофронтендами (external)
- Использовать import maps для общих зависимостей

---

## Полная конфигурация

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6011,
    strictPort: true,
    cors: true, // 👈 Разрешает кросс-доменные запросы в dev mode
  },
  preview: {
    port: 6011,
    strictPort: true,
    cors: true, // 👈 Разрешает кросс-доменные запросы в preview mode
  },
  build: {
    lib: {
      entry: './src/main.tsx', // 👈 Точка входа для библиотеки
      name: 'player', // 👈 Имя глобальной переменной
      formats: ['es'], // 👈 Формат: ES modules
      fileName: () => 'index.js', // 👈 Имя выходного файла
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // 👈 Все в один файл
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'), // 👈 Заменяет process.env
  },
})
```

---

## Важные замечания

### 1. Dev vs Preview mode

- **Dev mode** (`pnpm dev`): Vite не создает физические файлы, модули обрабатываются на лету
- **Preview mode** (`pnpm preview`): Сервер отдает уже собранные файлы из `dist/`
- Для микрофронтендов мы используем preview mode, потому что нужен собранный ES модуль

### 2. CORS в production

В production CORS настраивается на уровне веб-сервера (nginx, CloudFront, etc.):

```nginx
add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
```

### 3. Альтернативы current setup

Для более сложных сценариев рассмотрите:

- **Webpack Module Federation** - шаринг зависимостей между микрофронтендами
- **Vite Module Federation Plugin** - аналог для Vite
- **Import Maps** - нативный браузерный способ управления зависимостями
- **SystemJS** - альтернативная система модулей для Single-SPA
