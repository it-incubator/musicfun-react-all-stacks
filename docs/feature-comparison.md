# MusicFun: Feature Comparison

Сравнение двух реализаций одного и того же приложения на разных стеках.

|                  | RTK Query              | TanStack Query + Zustand                             |
| ---------------- | ---------------------- | ---------------------------------------------------- |
| **Server State** | RTK Query              | TanStack Query                                       |
| **Client State** | Redux Toolkit slices   | Zustand stores                                       |
| **API Types**    | Ручные типы в features | OpenAPI-generated (schema.ts via openapi-typescript) |
| **Base URL**     | `/rtkquery`            | `/tanstack-zustand`                                  |
| **Dev Port**     | 5176                   | 5175                                                 |

---

## 1. MainPage

### Секции на странице

| Секция         | RTK Query                    | TanStack Query + Zustand | TODO (TanStack) |
| -------------- | ---------------------------- | ------------------------ | --------------- |
| Tags (хештеги) | API (useFetchTagsQuery)      | API (useTags)            | OK              |
| New Playlists  | API (useFetchPlaylistsQuery) | API (usePlaylists)       | OK              |
| New Tracks     | API (useFetchTracksQuery)    | API (useTracksQuery)     | OK              |

### Различия в компонентах

| Аспект                | RTK Query                                                            | TanStack Query + Zustand                                             | TODO (TanStack) |
| --------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------- |
| TagsList принимает    | `Tag[]` (объекты `{id, name}`)                                       | `TagDto[]` (объекты `{id, name}`)                                    | OK              |
| Ссылка из тега        | `/${entity}?tags=${tag.id}`                                          | `/${entity}?tags=${tag.id}`                                          | OK              |
| Плейлисты на MainPage | PlaylistCard с полными данными (reactions, owner, date, tracksCount) | PlaylistCard с полными данными (reactions, owner, date, tracksCount) | OK              |
| Скелетон плейлистов   | PlaylistCardSkeleton (при загрузке)                                  | PlaylistCardSkeleton (при загрузке)                                  | OK              |
| TrackCard             | С reaction buttons (like/dislike)                                    | С reaction buttons (like/dislike)                                    | OK              |
| ContentList layout    | Есть variant `listRow`                                               | Только стандартный flex-wrap                                         | -               |

### Запуск воспроизведения на MainPage

|            | RTK Query                | TanStack Query + Zustand |
| ---------- | ------------------------ | ------------------------ |
| Как играть | Кнопка Play на TrackCard | Кнопка Play на TrackCard |
| Поведение  | Одинаковое               | Одинаковое               |

---

## 2. TracksPage

| Аспект                 | RTK Query                                        | TanStack Query + Zustand                  |
| ---------------------- | ------------------------------------------------ | ----------------------------------------- |
| **Данные**             | API                                              | API                                       |
| **Infinite Scroll**    | useInView (react-intersection-observer)          | useOnInView (react-intersection-observer) |
| **Поиск**              | Placeholder (onChange пустая функция `() => {}`) | Работает (debounce + state + запрос)      |
| **Сортировка**         | Placeholder (onChange пустая функция `() => {}`) | Работает (tracksSortFunction, 4 варианта) |
| **Фильтр по тегам**    | API (SearchTags компонент, реальный запрос)      | MOCK (Autocomplete с MOCK_HASHTAGS)       |
| **Фильтр по артистам** | API (SearchTags компонент, реальный запрос)      | MOCK (Autocomplete с MOCK_ARTISTS)        |
| **Скелетон**           | TracksTableSkeleton                              | Нет (текст "Loading...")                  |
| **Пустое состояние**   | "Nothing more to load"                           | "tracks_not_found"                        |
| **Duration в строке**  | 100 (hardcoded)                                  | 0 (hardcoded, TODO в коде)                |
| **Dislike count**      | Из API (track.attributes.dislikesCount)          | 0 (hardcoded)                             |
| **Artists в строке**   | `['Artist 1', 'Artist 2']` (hardcoded)           | `[]` (пустой массив, закомментировано)    |
| **Cover image**        | getImageByType(images, MEDIUM)                   | images.main[0].url (первый вариант)       |

### Запуск воспроизведения на TracksPage

|                                  | RTK Query                                                                 | TanStack Query + Zustand             | Нужно решить |
| -------------------------------- | ------------------------------------------------------------------------- | ------------------------------------ | ------------ |
| **Клик по строке**               | Да, вся строка кликабельна                                                | Через handleClickPlay (колонка play) | ?            |
| **Play/Pause toggle**            | Да (если трек уже играет - пауза)                                         | Только play (нет toggle)             | ?            |
| **Загрузка очереди**             | Загружает все треки в queue ('all-tracks'), добавляет новые при подгрузке | Играет один трек (без очереди)       | ?            |
| **Обновление queue при скролле** | Да (addToQueue при fetchNextPage)                                         | Нет                                  | ?            |

---

## 3. PlaylistsPage

| Аспект                 | RTK Query                                              | TanStack Query + Zustand                                                 |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Данные**             | API (useFetchPlaylistsQuery)                           | API (usePlaylists)                                                       |
| **Пагинация**          | Да (Pagination + usePageSearchParams)                  | Да (Pagination + state)                                                  |
| **Поиск**              | SearchTextField (через URL params)                     | SearchTextField (через state + debounce)                                 |
| **Сортировка**         | SortSelect (через URL params)                          | SortSelect (через state, 4 варианта: newest/oldest/mostLiked/leastLiked) |
| **Фильтр по тегам**    | API (SearchTags компонент)                             | API (Autocomplete + useTags)                                             |
| **Карточка плейлиста** | PlaylistCard (полная: reactions, owner, date, actions) | PlaylistItem entity (обёртка)                                            |
| **Скелетон**           | PlaylistCardSkeleton (showReactionButtons)             | Нет                                                                      |
| **Owner actions**      | PlaylistActions (edit/delete) при isOwnPlaylist        | Через PlaylistItem                                                       |
| **Page size**          | Через usePageSearchParams                              | PAGE_SIZE = 5                                                            |
| **Параметры в URL**    | Да (usePageSearchParams синхронизирует)                | Нет (только state)                                                       |

### Различия в подходе к поиску/фильтрации

|                           | RTK Query                                         | TanStack Query + Zustand              |
| ------------------------- | ------------------------------------------------- | ------------------------------------- |
| Управление параметрами    | `usePageSearchParams` hook (синхронизирует с URL) | Локальный state (useState)            |
| При изменении search/sort | Обновляет URL params                              | Обновляет state, сбрасывает page на 1 |
| При переходе назад        | URL восстанавливает состояние                     | Состояние теряется                    |

---

## 4. TrackPage (детальная страница трека)

| Аспект                         | RTK Query                           | TanStack Query + Zustand            |
| ------------------------------ | ----------------------------------- | ----------------------------------- |
| **Данные**                     | API (useFetchTrackByIdQuery)        | API (useTrackQuery)                 |
| **Header**                     | Gradient background + large cover   | Gradient background + large cover   |
| **Track info**                 | Title, artists, tags, date          | Title, artists, tags, date          |
| **Control panel**              | Play, like/dislike, edit (if owner) | Play, like/dislike, edit (if owner) |
| **Playlists containing track** | Показывает с поиском + пагинацией   | Показывает                          |
| **Color extraction**           | Dominant color из обложки           | Dominant color из обложки           |
| **Lyrics sub-page**            | Есть (route `/tracks/:id/lyrics`)   | Нет                                 |

---

## 5. PlaylistPage (детальная страница плейлиста)

| Аспект                    | RTK Query                                             | TanStack Query + Zustand                |
| ------------------------- | ----------------------------------------------------- | --------------------------------------- |
| **Данные**                | API (useFetchPlaylistByIdQuery)                       | API (usePlaylistQuery)                  |
| **Header**                | Gradient background + large cover                     | Gradient background + large cover       |
| **Playlist info**         | Title, description, tags                              | Title, description, tags                |
| **Control panel**         | Play all, like/dislike, edit (if owner), cover upload | Play all, like/dislike, edit (if owner) |
| **Tracks table**          | Full tracks table with search                         | Tracks table                            |
| **Owner: remove track**   | Да                                                    | Нужно проверить                         |
| **Owner: reorder tracks** | Да                                                    | Нужно проверить                         |
| **Cover upload**          | Да (image cropping)                                   | Нужно проверить                         |

---

## 6. UserPage (профиль пользователя)

| Аспект                  | RTK Query                              | TanStack Query + Zustand                |
| ----------------------- | -------------------------------------- | --------------------------------------- |
| **User info**           | API (useMeQuery + profileSlice)        | Hardcoded (Martin Fowler, unsplash.it)  |
| **Avatar**              | Из API / localStorage                  | Hardcoded URL                           |
| **Stats**               | Из API (playlists count, tracks count) | Hardcoded (58, 100)                     |
| **Edit profile button** | Открывает EditProfileModal             | UI есть, функциональность не подключена |
| **Color extraction**    | Dominant color из аватара              | Нет                                     |

### Табы на UserPage

| Таб                          | RTK Query                          | TanStack Query + Zustand  |
| ---------------------------- | ---------------------------------- | ------------------------- |
| Playlists                    | API                                | MOCK (через PlaylistsTab) |
| Tracks                       | API                                | MOCK (через TracksTab)    |
| Liked Playlists (owner only) | API                                | MOCK (MOCK_PLAYLISTS)     |
| Liked Tracks (owner only)    | API                                | MOCK (MOCK_TRACKS)        |
| isProfileOwner check         | API (сравнение userId с me.userId) | Hardcoded `true`          |

---

## 7. Player Widget

| Аспект                 | RTK Query                                                                  | TanStack Query + Zustand                                                  |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **State manager**      | Redux slice (playerSlice)                                                  | Zustand store (player-store)                                              |
| **Audio**              | `new Audio()` (простой)                                                    | `AudioManager` singleton class (typed events, throttled updates, timeout) |
| **Middleware**         | playerMiddleware (Redux middleware)                                        | Нет (логика в store actions)                                              |
| **Queue management**   | Полная (loadPlaylist, addToQueue, insertNext, removeFromQueue, clearQueue) | Базовая                                                                   |
| **Repeat modes**       | off / one / all                                                            | off / one / all                                                           |
| **Shuffle**            | Да                                                                         | Да                                                                        |
| **Volume persistence** | localStorage                                                               | localStorage                                                              |
| **Keyboard shortcuts** | Space (play/pause), arrows                                                 | Нужно проверить                                                           |

---

## 8. Auth

| Аспект                | RTK Query                             | TanStack Query + Zustand                          |
| --------------------- | ------------------------------------- | ------------------------------------------------- |
| **Login**             | OAuth + email/password modal          | OAuth modal                                       |
| **Token storage**     | localStorage (raw strings)            | authStorage utility (JSON wrapper)                |
| **localStorage keys** | `accessToken`, `refreshToken`         | `musicfun-access-token`, `musicfun-refresh-token` |
| **Token refresh**     | Автоматический с async-mutex          | Через API SDK interceptors                        |
| **Token в запросах**  | RTK Query base query (fetchBaseQuery) | API SDK ApiClient interceptors                    |
| **Logout**            | Очищает tokens + resets API state     | Очищает tokens через authStorage                  |

---

## 9. Общие компоненты (UI Kit)

| Компонент                   | RTK Query                   | TanStack Query + Zustand |
| --------------------------- | --------------------------- | ------------------------ |
| Button                      | Да                          | Да                       |
| Card                        | Да                          | Да                       |
| Skeleton                    | Да                          | Да (shimmer animation)   |
| Typography                  | Да                          | Да                       |
| Tabs                        | Да                          | Да                       |
| Pagination                  | Да                          | Да                       |
| Spinner                     | Да                          | Да                       |
| TextField / SearchTextField | Да                          | Да                       |
| SortSelect                  | Да                          | Да                       |
| DropdownMenu                | Да                          | Да                       |
| Dialog (Modal)              | Да                          | Да                       |
| Tag                         | Да                          | Да                       |
| Progress                    | Да                          | Да                       |
| ReactionButtons             | Да                          | Да                       |
| Autocomplete                | Нет (использует SearchTags) | Да (отдельный компонент) |
| ImageUploader               | Да                          | Нужно проверить          |
| PlaylistCardSkeleton        | Да                          | Да                       |
| TracksTableSkeleton         | Да                          | Нет                      |

---

## 10. Mock Data Usage

### RTK Query

| Где                        | Что                           | Файл                         |
| -------------------------- | ----------------------------- | ---------------------------- |
| MainPage tracks (fallback) | MOCK_TRACKS                   | features/tracks/api/mocks    |
| Playlists (fallback)       | MOCK_PLAYLISTS, MOCK_PLAYLIST | features/playlists/api/mocks |
| Tracks artists             | API (`included` artists)      | inline                       |
| Track duration             | Hardcoded `100`               | inline                       |

> В целом RTK Query проект использует API повсеместно, моки только как fallback.

### TanStack Query + Zustand

| Где                      | Что                         | Файл                             |
| ------------------------ | --------------------------- | -------------------------------- |
| TracksPage tag filter    | MOCK_HASHTAGS               | features/tags/api/tags-api       |
| TracksPage artist filter | MOCK_ARTISTS                | features/artists/api/artists-api |
| UserPage info            | Hardcoded                   | pages/UserPage/ui/UserInfo       |
| UserPage all tabs        | MOCK_TRACKS, MOCK_PLAYLISTS | pages/UserPage/ui/UserTabs/\*    |
| Track duration           | Hardcoded `0`               | inline                           |
| Track dislikesCount      | Hardcoded `0`               | inline                           |
| Track artists            | API (`included` artists)    | inline                           |
| isProfileOwner           | Hardcoded `true`            | pages/UserPage/ui/UserTabs       |

> TanStack Query проект использует моки для фильтров на TracksPage, UserPage.

---

## 11. Различия в UX-поведении (нужно решить)

| Поведение                                      | RTK Query                                              | TanStack Query + Zustand                             | Какое правильное? |
| ---------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- | ----------------- |
| TracksPage: как начать воспроизведение         | Клик по строке целиком                                 | Клик по кнопке play в строке                         | TBD               |
| TracksPage: play/pause toggle на текущем треке | Да (клик по играющему треку = пауза)                   | Нет (только запуск нового play)                      | TBD               |
| TracksPage: загрузка очереди                   | Все треки загружаются в queue, добавляются при скролле | Играет один трек, нет очереди                        | TBD               |
| PlaylistsPage: URL-sync фильтров               | Да (usePageSearchParams синхр. с URL)                  | Нет (state теряется при навигации)                   | TBD               |
| UserPage: реальные данные или моки             | API                                                    | Hardcoded/Mocks                                      | TBD               |
| Скелетоны при загрузке                         | Да (PlaylistCardSkeleton, TracksTableSkeleton)         | Да (PlaylistCardSkeleton), TracksTableSkeleton — нет | TBD               |
| SearchTags vs Autocomplete                     | SearchTags (API-backed, tag-style)                     | Autocomplete (dropdown, может использовать mock/API) | TBD               |
| Track lyrics page                              | Есть (/tracks/:id/lyrics)                              | Нет                                                  | TBD               |

---

## 12. Features present only in one project

### Only in RTK Query

1. **TrackLyricsPage** (route `/tracks/:id/lyrics`)
2. **ProfileSlice** (avatar, name management + localStorage sync)
3. **playerMiddleware** (Redux middleware для side-effects плеера)
4. **Optimistic updates** для реакций (like/dislike кэш обновляется мгновенно)
5. **TracksTableSkeleton**
6. **SearchTags component** (API-backed tag search)
7. **usePageSearchParams** (URL sync для фильтров/поиска/пагинации)
8. **ContentList listRow variant** (вертикальный layout)
9. **Image cropping** для cover upload (react-easy-crop)
10. **Color extraction** на UserPage
11. **Queue management** на TracksPage (addToQueue при подгрузке)

### Only in TanStack Query + Zustand

1. **AudioManager class** (typed events, throttled timeupdate, promise-based loadTrack)
2. **Autocomplete component** (generic dropdown with multi-select)
3. **Working search** на TracksPage (debounce + API request)
4. **Working sort** на TracksPage (4 sort options с tracksSortFunction)
5. **Working sort** на PlaylistsPage (4 sort options с sortConfig)
6. **OpenAPI-generated types** (schema.ts via `pnpm generate:api`)
7. **entities layer** (FSD entities: PlaylistCard, PlaylistItem)
8. **VU (Validation Utils)** - утилита для проверки данных (isValid, isNotEmptyArray)
9. **authStorage** - типизированная обёртка для работы с токенами
