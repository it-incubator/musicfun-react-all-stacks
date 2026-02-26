# MusicFun - TanStack Query + Zustand Stack

## Stack

| Category        | Technology                                           | Version |
| --------------- | ---------------------------------------------------- | ------- |
| Framework       | React                                                | 19.1.0  |
| Routing         | React Router                                         | 7.6.2   |
| Server State    | TanStack Query (@tanstack/react-query)               | -       |
| Client State    | Zustand                                              | -       |
| Build Tool      | Vite                                                 | -       |
| Language        | TypeScript                                           | ~5.8.3  |
| UI Components   | @headlessui/react                                    | -       |
| Forms           | react-hook-form + zod                                | -       |
| i18n            | i18next + react-i18next                              | -       |
| Infinite Scroll | react-intersection-observer                          | -       |
| API Types       | OpenAPI-generated (schema.ts via openapi-typescript) | -       |
| API Client      | openapi-fetch                                        | 0.14.0  |
| Storybook       | Storybook                                            | -       |
| CSS             | CSS Modules                                          | -       |
| Linting         | ESLint + Stylelint + Prettier                        | -       |

## Config

- **Base URL path**: `/tanstack-zustand`
- **Dev server port**: 5175
- **API Base**: `import.meta.env.VITE_BASE_URL`
- **API Key**: `import.meta.env.VITE_API_KEY`
- **Auth Token fallback**: `import.meta.env.VITE_AUTH_TOKEN`

## Architecture

**Pattern**: Feature-Sliced Design (FSD), аналогичен RTK Query проекту, с отличиями в слое entities и подходе к API.

```
src/
├── app/                        # Application layer
│   └── routing/                # React Router routes definition
├── entities/                   # Entity layer (FSD)
│   └── playlist/               # PlaylistCard, PlaylistItem entities
├── features/                   # Feature modules
│   ├── auth/                   # Auth: login modal, OAuth
│   │   ├── api/                # TanStack Query hooks (useMeQuery, useLogin, useLogout)
│   │   ├── model/              # Нет Redux slice, используется Zustand / локальный стейт
│   │   └── ui/                 # LoginModal, AccountMenu
│   ├── playlists/              # Playlists feature
│   │   ├── api/                # TanStack Query hooks (usePlaylists, usePlaylist) + mocks
│   │   ├── model/              # Zustand store (playlists-store: модалки create/edit)
│   │   └── ui/                 # PlaylistCard, PlaylistActions
│   ├── tracks/                 # Tracks feature
│   │   ├── api/                # TanStack Query hooks + mocks
│   │   └── ui/                 # TrackCard, TrackRow, TrackRowContainer, TracksTable
│   ├── tags/                   # Tags feature
│   │   ├── api/                # TanStack Query hooks (useTags)
│   │   └── ui/                 # TagsList
│   └── artists/                # Artists feature
│       └── api/                # Mock data (MOCK_ARTISTS)
├── pages/                      # Page-level components
│   ├── MainPage/
│   ├── TracksPage/
│   │   └── model/              # useTracksInfinityQuery hook
│   ├── PlaylistsPage/
│   ├── TrackPage/
│   ├── PlaylistPage/
│   ├── UserPage/
│   │   └── ui/                 # UserInfo, UserTabs (Playlists, Tracks, LikedPlaylists, LikedTracks)
│   ├── auth/                   # OAuthCallback page
│   └── common/                 # Shared page components
│       └── ContentList, PageWrapper, SearchTextField, SortSelect
├── layout/                     # App shell
│   ├── Header/
│   ├── Sidebar/
│   └── Layout.tsx
├── widgets/                    # Complex UI widgets
│   └── Player/                 # Music player widget UI
├── player/                     # Player business logic
│   ├── model/
│   │   ├── player-store.ts     # Zustand store (playback, queue, modes)
│   │   └── audio-manager.ts    # AudioManager singleton class
│   ├── types/                  # Player types
│   └── utils/                  # Track conversion utils
└── shared/                     # Shared layer
    ├── api/                    # API client setup, schema.ts (OpenAPI types)
    ├── components/             # UI Kit (Button, Card, Skeleton, Tabs, Autocomplete, etc.)
    ├── hooks/                  # useDebounceValue, etc.
    ├── types/                  # Common types
    ├── utils/                  # authStorage, VU (validation utils), etc.
    └── icons/                  # SVG icon components
```

## State Management

### Server State (TanStack Query)

- Custom hooks на базе `useQuery` / `useInfiniteQuery` / `useMutation`
- Типы из `schema.ts` (OpenAPI-generated, см. раздел "API Schema")
- Query keys по конвенции: `['tracks', params]`, `['playlists', params]`
- Нет системы тегов/инвалидации как в RTK Query (ручной `invalidateQueries`)

### Client State (Zustand)

| Store             | Назначение                                               |
| ----------------- | -------------------------------------------------------- |
| `player-store`    | Полное состояние плеера (playback, queue, volume, modes) |
| `playlists-store` | Состояние модалки создания/редактирования плейлиста      |

### Auth Flow

1. OAuth login -> tokens через `authStorage` utility
2. `authStorage.getAccessToken()` / `saveAccessToken()` / `clearTokens()`
3. Хранение в localStorage как JSON: `{ accessToken: "..." }`
4. Keys: `musicfun-access-token`, `musicfun-refresh-token`

## Player Architecture

- **Store**: Zustand `player-store.ts`
- **Audio**: `AudioManager` singleton class (not raw `new Audio()`)
  - Event system (on/off/emit) с типизированными событиями
  - Throttled timeupdate (0.5s interval)
  - loadTrack с timeout (30s) и Promise-based API
  - Методы: play, pause, stop, seek, setVolume, setMuted
- **State**: playbackState, currentTrack, queue, volume, repeatMode, shuffleMode
- **Hooks**: `usePlayerControls`, `useCurrentTrack`, `usePlaybackProgress`, `usePlaybackState`

## Routes

| Route              | Page          | Description                     |
| ------------------ | ------------- | ------------------------------- |
| `/`                | MainPage      | Tags, new playlists, new tracks |
| `/tracks`          | TracksPage    | All tracks with infinite scroll |
| `/tracks/:id`      | TrackPage     | Single track detail             |
| `/playlists`       | PlaylistsPage | All playlists with pagination   |
| `/playlists/:id`   | PlaylistPage  | Playlist detail with tracks     |
| `/profile/:userId` | UserPage      | User profile with tabs          |
| `/oauth/callback`  | OAuthCallback | OAuth redirect handler          |

## Commands

```bash
pnpm dev          # Start dev server (port 5175)
pnpm build        # Build for production
pnpm storybook    # Start Storybook
```

## API Schema

**ВАЖНО: `src/shared/api/schema.ts` - автогенерируемый файл. НИКОГДА не редактировать вручную.**

Генерация типов из OpenAPI-спецификации бэкенда:

```bash
pnpm generate:api    # Генерирует schema.ts из https://musicfun.it-incubator.app/api-json
```

- Используется `openapi-typescript` для генерации TypeScript типов
- Используется `openapi-fetch` как типизированный HTTP-клиент
- Флаги генерации: `--root-types --enum --enum-values --dedupe-enums`
- При изменении API бэкенда: перегенерировать через `pnpm generate:api`
