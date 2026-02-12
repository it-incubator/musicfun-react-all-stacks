# MusicFun - RTK Query Stack

## Stack

| Category        | Technology                    | Version         |
| --------------- | ----------------------------- | --------------- |
| Framework       | React                         | 19.1.0          |
| Routing         | React Router                  | 7.6.2           |
| Server State    | RTK Query (Redux Toolkit)     | 2.8.2           |
| Client State    | Redux Toolkit (slices)        | 2.8.2           |
| Build Tool      | Vite                          | 6.3.5           |
| Language        | TypeScript                    | ~5.8.3          |
| UI Components   | @headlessui/react             | 2.2.4           |
| Forms           | react-hook-form + zod         | 7.58.0 / 4.2.0  |
| i18n            | i18next + react-i18next       | 25.5.2 / 15.7.3 |
| Infinite Scroll | react-intersection-observer   | 10.0.0          |
| Notifications   | react-toastify                | 11.0.5          |
| Image Crop      | react-easy-crop               | 5.4.2           |
| Auth Mutex      | async-mutex                   | 0.5.0           |
| Storybook       | Storybook                     | 9.0.8           |
| CSS             | CSS Modules                   | -               |
| Linting         | ESLint + Stylelint + Prettier | -               |

## Config

- **Base URL path**: `/rtkquery`
- **Dev server port**: 5176
- **API Base**: `import.meta.env.VITE_BASE_URL`
- **API Key**: `import.meta.env.VITE_API_KEY`
- **Auth Token fallback**: `import.meta.env.VITE_AUTH_TOKEN`

## Architecture

**Pattern**: Feature-Sliced Design (FSD) с послойной организацией.

```
src/
├── app/                        # Application layer
│   ├── api/                    # RTK Query base API setup + auth interceptors
│   ├── routing/                # React Router routes definition
│   └── store/                  # Redux store configuration
├── features/                   # Feature modules (FSD "features" layer)
│   ├── auth/                   # Auth: login modal, OAuth, token management
│   │   ├── api/                # RTK Query endpoints (login, logout, me, refresh)
│   │   ├── model/              # Redux slice (auth modal state)
│   │   └── ui/                 # LoginModal, AccountMenu
│   ├── playlists/              # Playlists feature
│   │   ├── api/                # RTK Query endpoints + mocks
│   │   ├── model/              # Redux slice (create/edit modal) + hooks
│   │   └── ui/                 # PlaylistCard, PlaylistCardSkeleton, PlaylistActions
│   ├── tracks/                 # Tracks feature
│   │   ├── api/                # RTK Query endpoints + mocks
│   │   ├── model/              # Redux slice (create/edit modal) + hooks
│   │   └── ui/                 # TrackCard, TrackRow, TracksTable, TrackActions
│   ├── tags/                   # Tags feature
│   │   ├── api/                # RTK Query endpoints
│   │   └── ui/                 # TagsList, SearchTags
│   ├── artists/                # Artists feature
│   │   └── api/                # RTK Query endpoints
│   └── profile/                # User profile feature
│       ├── model/              # Redux slice (avatar, name, edit modal)
│       └── ui/                 # EditProfileModal
├── pages/                      # Page-level components
│   ├── MainPage/
│   ├── TracksPage/
│   ├── PlaylistsPage/
│   ├── TrackPage/
│   ├── PlaylistPage/
│   ├── UserPage/
│   ├── auth/                   # OAuthCallback page
│   └── common/                 # Shared page components
│       ├── ui/                 # PageWithHeader, ContentList, SearchTextField, SortSelect, SearchTags
│       └── hooks/              # usePageSearchParams
├── layout/                     # App shell
│   ├── Header/
│   ├── Sidebar/
│   └── Layout.tsx
├── widgets/                    # Complex UI widgets
│   └── Player/                 # Music player widget UI
├── player/                     # Player business logic
│   ├── playerSlice.ts          # Redux slice (playback, queue, modes)
│   ├── playerHooks.ts          # Custom hooks for player controls
│   ├── playerMiddleware.ts     # Redux middleware for player side-effects
│   ├── player.ts               # Audio element (new Audio())
│   └── utils/                  # Track conversion utils
└── shared/                     # Shared layer
    ├── components/             # UI Kit (Button, Card, Skeleton, Tabs, etc.)
    ├── hooks/                  # useDebounceValue, useHover, etc.
    ├── types/                  # Common API types
    ├── utils/                  # getImageByType, etc.
    └── icons/                  # SVG icon components
```

## State Management

### Server State (RTK Query)

- `baseApi` с fetch-based base query
- Tag types: `['Playlist', 'Track', 'Artist', 'Tag', 'User']`
- Автоматическая инвалидация кэша через теги
- Optimistic updates для реакций (like/dislike)
- `onQueryStarted` hooks для ручного обновления кэша

### Client State (Redux Slices)

| Slice            | Назначение                                                    |
| ---------------- | ------------------------------------------------------------- |
| `authSlice`      | Состояние модалки авторизации                                 |
| `tracksSlice`    | Состояние модалки создания/редактирования трека               |
| `playlistsSlice` | Состояние модалки создания/редактирования плейлиста           |
| `profileSlice`   | Аватар, имя пользователя, модалка профиля + localStorage sync |
| `playerSlice`    | Полное состояние плеера (playback, queue, volume, modes)      |

### Auth Flow

1. OAuth login -> accessToken + refreshToken в localStorage
2. Bearer token в заголовке каждого запроса
3. При 401 -> автоматический refresh через async-mutex
4. Logout -> очистка токенов + сброс API state

## Player Architecture

- **State Machine**: `playbackState` = idle | loading | playing | paused | error
- **Queue**: `queue[]`, `originalQueue[]`, `queueIndex`, `hasNextTrack`, `hasPreviousTrack`
- **Modes**: `repeatMode` (off/one/all), `shuffleMode`
- **Persistence**: volume, repeat, shuffle -> localStorage
- **Audio**: `new Audio()` в `player.ts`
- **Middleware**: `playerMiddleware` для side-effects

## Routes

| Route                | Page            | Description                     |
| -------------------- | --------------- | ------------------------------- |
| `/`                  | MainPage        | Tags, new playlists, new tracks |
| `/tracks`            | TracksPage      | All tracks with infinite scroll |
| `/tracks/:id`        | TrackPage       | Single track detail             |
| `/tracks/:id/lyrics` | TrackLyricsPage | Track lyrics                    |
| `/playlists`         | PlaylistsPage   | All playlists with pagination   |
| `/playlists/:id`     | PlaylistPage    | Playlist detail with tracks     |
| `/profile/:userId`   | UserPage        | User profile with tabs          |
| `/oauth/callback`    | OAuthCallback   | OAuth redirect handler          |

## Commands

```bash
pnpm dev          # Start dev server (port 5176)
pnpm build        # Build for production
pnpm storybook    # Start Storybook
```
