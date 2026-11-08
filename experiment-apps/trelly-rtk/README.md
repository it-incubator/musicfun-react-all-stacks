# Trelly (RTK Query)

Клон Trello на React 19 + Redux Toolkit Query + MUI, покрывающий весь [Trelly API](https://trelly.it-incubator.app/api).

## 🚀 Запуск

```bash
pnpm i
pnpm dev          # http://localhost:3000 (если порт занят — Vite возьмёт следующий)
```

### Переменные окружения

- `.env` — `VITE_BASE_URL`, `VITE_DOMAIN_ADDRESS`
- `.env.local` (gitignored) — `VITE_API_KEY` из [API Hub](https://apihub.it-incubator.io/en). У ключа должен быть разрешён домен, с которого открыт фронт (например `http://localhost:3000`)

❗ На бесплатном плане API Hub — **100 запросов в день** на ключ. Сверх лимита API отвечает `429 Limit has been reached`.

## ✨ Возможности

- **Explore** — публичные доски всех пользователей (с пагинацией) и лента последних задач
- **Вход** — логин/пароль (`/auth/simple/*`) или OAuth через API Hub (popup, с фолбэком на редирект), автоматический refresh токенов
- **Мои доски** — создание (до 10), редактирование, «важная» звезда, обложка (горизонтальная, высота ≥ 500px), удаление, drag & drop сортировка
- **Доска** — список с drag & drop сортировкой, канбан по статусам (перетаскивание меняет статус), поиск и фильтры по статусу, до 20 задач
- **Задача** — inline-редактирование (PATCH), «Edit all fields» (PUT), перенос на другую доску, удаление, вложения (до 5 файлов по 100 KB, превью картинок)
- Чужие доски и задачи открываются в режиме только для чтения; светлая и тёмная тема; адаптив под телефон

## 🔌 Покрытие API

| Эндпоинт                                                        | Где используется                              |
| --------------------------------------------------------------- | --------------------------------------------- |
| `GET /boards`                                                   | Explore → Boards                              |
| `GET /boards/my`                                                | Мои доски, определение владельца доски        |
| `POST /boards`                                                  | «New board»                                   |
| `GET /boards/{id}`                                              | Страница доски                                |
| `PUT /boards/{id}`                                              | «Edit board» (все поля)                       |
| `PATCH /boards/{id}`                                            | Звезда «важная» (оптимистично)                |
| `DELETE /boards/{id}`                                           | «Delete board»                                |
| `PUT /boards/{id}/reorder`                                      | Drag & drop досок, «Move to first»            |
| `POST /boards/{id}/images/main`                                 | «Change cover»                                |
| `GET /boards/tasks`                                             | Explore → Latest tasks                        |
| `GET /boards/{id}/tasks`                                        | Задачи доски                                  |
| `POST /boards/{id}/tasks`                                       | «Add task»                                    |
| `GET /boards/{id}/tasks/{taskId}`                               | Диалог задачи                                 |
| `PUT /boards/{id}/tasks/{taskId}`                               | «Edit all fields»                             |
| `PATCH /boards/{id}/tasks/{taskId}`                             | Чекбокс, канбан, inline-правки (оптимистично) |
| `DELETE /boards/{id}/tasks/{taskId}`                            | «Delete task»                                 |
| `PUT /boards/{id}/tasks/{taskId}/reorder`                       | Drag & drop задач                             |
| `PUT /boards/{id}/tasks/{taskId}/move`                          | «Move to board»                               |
| `POST /boards/{id}/tasks/{taskId}/attachments`                  | «Attach files»                                |
| `DELETE /boards/{id}/tasks/{taskId}/attachments/{attachmentId}` | Удаление вложения                             |
| `GET /auth/oauth-redirect`, `POST /auth/login`                  | «Continue with API Hub»                       |
| `POST /auth/refresh`, `POST /auth/logout`                       | Refresh / выход для OAuth-сессии              |
| `POST /auth/simple/login`, `/refresh`, `/logout`                | Вход по логину и паролю                       |
| `GET /auth/me`                                                  | Текущий пользователь                          |

Снимок спецификации, по которой написан клиент, — в [`api-snapshot/`](api-snapshot/README.md).

## 🗂 Структура

```
src/
├── app/            # store, baseApi (+ refresh токенов), App, Routing
├── common/         # общие компоненты, утилиты, тема, константы
├── features/
│   ├── auth/       # authApi, токены, Login, OAuthCallback, UserMenu
│   ├── boards/     # boardsApi, карточки, формы, сортировка, обложки
│   └── tasks/      # tasksApi, список, канбан, диалог задачи, вложения
└── pages/          # ExplorePage, MyBoardsPage, BoardPage
```

## 🧪 E2E тесты (Playwright)

Используется установленный Google Chrome (`channel: "chrome"`), качать браузеры Playwright не нужно.

```bash
pnpm test:e2e        # 25 UI-тестов на in-memory fake API — квоту API Hub не тратят
pnpm test:e2e:ui     # то же в Playwright UI
pnpm test:e2e:live   # smoke-тест на реальном API (~20 запросов из дневной квоты)
```

- `e2e/fake-api.ts` — фейковый Trelly-бэкенд на `page.route`: тот же контракт, лимиты, сортировка и ошибки, что у реального API
- Для live-теста создайте `.env.e2e.local` по образцу `.env.e2e.example` (`E2E_LOGIN`, `E2E_PASSWORD`). Тест создаёт свою доску и удаляет её в конце

## 🅿️ Prettier

❗Обязательно включите в настройках Webstorm `prettier`
