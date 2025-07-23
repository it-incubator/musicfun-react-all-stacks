# 🚀 Запуск проекта

Информация по запуску проектов находиться в `README.md` каждого отдельного репозитория

## Actual projects

- musicfun-ui-vanilla - full project html/css/storybook vanilla without ui libraries

- musicfun-tanstack-query - full project with tanstack query

- musicfun-rtk-query - full project with rtk-query

## ❌ Запуск проекта с SDK (в данный момент не поддерживается)

### 1. Установка зависимостей

В корне проекта запустить (установятся зависимости для всех приложений и пакетов)

```bash
pnpm i
```

### 2. SDK build

Затем сбилдить `musicfun-api-sdk`

```bash
pnpm build:sdk
```

️🔔 Возможно данные скрипты не являются кросc-платформенными

```json
"scripts": {
"clean": "rm -rf dist",
"build": "pnpm run clean && tsc"
}
```

тогда попробуй альтернативную команду попроще

```bash
pnpm build:sdk:simple
```

### 3. Старт проекта

- 🎶musicfun на **tanstack**

```bash
   pnpm start:musicfun-tanstack
```

- 🎶musicfun на **rtk-query**

```bash
    pnpm start:musicfun-rtk
```

- 🎶musicfun на **nextjs**

```bash
     pnpm start:musicfun-nextjs
```

## ✅ Рекомендованные форматы нейминга файлов в React/TypeScript проектах

| Категория             | Рекомендуемый формат                                | Пример                                |
| --------------------- | --------------------------------------------------- | ------------------------------------- |
| **Компоненты**        | `PascalCase`                                        | `UserCard.tsx`                        |
| **Хуки**              | `kebab-case` _(или `camelCase`, если единый стиль)_ | `use-playlists.ts`, `useAuth.ts`      |
| **Утилиты (utils)**   | `kebab-case`                                        | `format-date.ts`, `validate-email.ts` |
| **Redux Slice/State** | `kebab-case`                                        | `auth-slice.ts`, `user-slice.ts`      |
| **API-файлы**         | `kebab-case`                                        | `playlists-api.ts`, `auth-api.ts`     |
| **Types/Interfaces**  | `kebab-case`                                        | `user.types.ts`, `auth.types.ts`      |
| **Сервисы**           | `kebab-case`                                        | `auth-service.ts`, `user-service.ts`  |
| **Моки (мок-данные)** | `kebab-case`                                        | `user-mocks.ts`, `playlist-mocks.ts`  |

### Happy hacking 🚀
