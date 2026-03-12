# MusicFun: Feature Comparison (RTK Query vs TanStack Query + Zustand)

Проверка кода: **2026-03-12**  
Сравнивались:

- `apps/rtk-query`
- `apps/tanstack-query-zustand`

Цель документа: зафиксировать **актуальный** функциональный паритет и реальные расхождения по коду.

## Содержание

**Синхронизировано:**

1. [Pagination component](#21-pagination-component)
2. [UserTabs: tab switch + page-reset](#22-usertabs-tab-switch--page-reset)
3. [UserPage background color](#23-userpage-background-color)
4. [UserPage tabs + URL](#24-userpage-tabs--url)
5. [PlaylistPage: duration fallback](#25-playlistpage-duration-fallback)
6. [Edit profile flow](#26-edit-profile-flow)
7. [Header / account menu](#27-header--account-menu)
8. [TracksPage](#28-trackspage)
9. [TrackPage](#29-trackpage)
10. [TrackLyricsPage](#210-tracklyricspage)
11. [TrackActions](#211-trackactions)
12. [Create/Edit Playlist Modal](#212-createedit-playlist-modal)
13. [Player: логика store/queue/playback](#213-player-логика-storequeuereplayback)

**Расхождения:**

1. [Routing: lyrics path + OAuthRedirect](#31-routing-lyrics-path--oauthredirect)
2. [MyLikedPlaylistsTab: owner actions](#32-mylikedplayliststab-owner-actions-отсутствуют-в-tanstack)
3. [MainPage / PlaylistsPage: owner actions](#33-mainpage--playlistspage-owner-actions-на-карточках)
4. [PlaylistPage ControlPanel: Delete action](#34-playlistpage-controlpanel-delete-action)
5. [UserPage: conditional rendering](#35-userpage-conditional-rendering-контента)
6. [PlaylistsPage: token gate](#36-playlistspage-token-gate)
7. [Create/Edit Track Modal](#37-createedit-track-modal-различия-в-функционале)
8. [Track data в таблицах: hardcoded vs API](#38-track-data-в-таблицах-hardcoded-vs-api)
9. [Player widget](#39-player-widget-tanstack-виджет-не-подключён-к-store)
10. [Player: архитектурные отличия](#310-player-архитектурные-отличия)

---

## 1. Краткий статус

| Блок                                    | Статус                | Комментарий                                                                                         |
| --------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| MainPage                                | ⚠️                    | Playback/карточки синхронизированы, но owner actions на карточках плейлистов отсутствуют в TanStack |
| TracksPage                              | ✅                    | Поиск/сортировка/playback/очередь/infinite scroll синхронизированы                                  |
| TrackPage                               | ✅                    | Skeleton, gradient, playback/control panel синхронизированы                                         |
| PlaylistPage                            | ⚠️                    | Skeleton, gradient, reactions, edit синхронизированы; TanStack имеет Delete action, RTK — нет       |
| UserPage core (profile/tabs/background) | ⚠️                    | URL-tab sync, background extraction, skeleton — есть; отличие в conditional rendering контента      |
| UserPage tabs (Playlists/Tracks/Liked)  | ✅                    | Pagination через URL, tab switch с page-reset, skeleton — синхронизированы                          |
| UserPage: MyLikedPlaylistsTab           | ⚠️                    | Контент/поведение отличается от RTK (нет owner actions, только reactions)                           |
| Header + account menu                   | ✅                    | Поведение account menu и logout flow в рабочем паритете                                             |
| Pagination component                    | ✅                    | Компонент идентичен: оба используют `alwaysVisible` prop, `return null` при `pagesCount <= 1`       |
| Routing                                 | ⚠️                    | Различие в path-шаблоне lyrics-route и расположении OAuthRedirect                                   |
| PlaylistsPage                           | ⚠️                    | TanStack: token gate + нет owner actions на карточках; RTK: owner actions есть                      |
| Create/Edit Track Modal                 | ⚠️                    | RTK: развитая форма (playlists, tags, artists); TanStack: упрощённая (title, lyrics, file)          |
|                                         | Track data в таблицах | ⚠️                                                                                                  | RTK: hardcoded artists/duration; TanStack: реальные данные из API с fallback  |
|                                         | Player store/logic    | ✅                                                                                                  | Идентичный набор фич: queue, shuffle, repeat, seek, volume, keyboard controls |
|                                         | Player widget         | ⚠️                                                                                                  | RTK: полностью подключён к store; TanStack: заглушка, не подключён к store    |

---

## 2. Что синхронизировано (актуально)

### 2.1 Pagination component

- Компонент `Pagination` теперь **идентичен** в обоих проектах.
- Оба поддерживают prop `alwaysVisible` (default `false`): при `!alwaysVisible && pagesCount <= 1` — `return null`.
- Старое расхождение (TanStack рендерил всегда) — **закрыто**.

### 2.2 UserTabs: tab switch + page-reset

- В обоих проектах при переключении таба удаляется `page` из query-параметров.
- Логика `handleTabChange` и `useEffect` для валидации `tabFromUrl` — идентична.
- Старое расхождение (RTK не сбрасывал `page`) — **закрыто**.

### 2.3 UserPage background color

- В обоих проектах `useUserPageBackgroundColor` использует `profile avatar -> decode base64 -> dominant color`.

### 2.4 UserPage tabs + URL

- Таб берётся из `?tab=...`, разрешённые табы зависят от `isProfileOwner`.
- `searchParams` используются для `page` и pagination state.

### 2.5 PlaylistPage: duration fallback

- В обоих проектах в таблице треков плейлиста используется fallback `duration: 100` до фикса API.

### 2.6 Edit profile flow

- В обоих проектах: modal flow редактирования профиля, сохранение в `localStorage`, обновление avatar/fullName.
- Оба поддерживают crop-step при загрузке изображения через `ImageUploader`.
- Различие в валидации: RTK — `zodResolver`, TanStack — `rules.validate` (не влияет на UX).

### 2.7 Header / account menu

- В обоих проектах:
  - skeleton в auth action-зоне при `me` loading;
  - отображение avatar/fullName/login из profile store;
  - переход в профиль;
  - logout с очисткой profile-store.

### 2.8 TracksPage

- Поиск, сортировка (через URL), фильтрация по tags и artists, infinite scroll, playback с очередью — синхронизированы.
- Оба используют `all-tracks` playlistId и дописывают новые треки в queue при подгрузке.

### 2.9 TrackPage

- Skeleton, gradient background, playback ControlPanel (play/pause/resume), TrackOverview, поиск плейлистов, pagination — синхронизированы.

### 2.10 TrackLyricsPage

- Функционально идентичны: gradient background, back button, lyrics display.

### 2.11 TrackActions

- В обоих проектах: ReactionButtons, TrackActionsMenu (edit/delete/publish/add-to-playlist), ChoosePlaylistModal с `syncTrackPlaylists`.

### 2.12 Create/Edit Playlist Modal

- В обоих проектах: create/edit mode, title/description/tags, image upload с crop, cover upload.

### 2.13 Player: логика store/queue/playback

Оба проекта реализуют **идентичный набор функциональности** плеера:

- **State**: `currentTrackId`, `currentPlaylistId`, `playbackState` (`idle`/`playing`/`paused`/`loading`/`error`), `currentTime`, `duration`, `buffered`, `volume`, `isMuted`.
- **Queue**: нормализованное хранилище треков (`tracks: Record<string, Track>`), `queue`/`originalQueue`/`queueIndex`.
- **Actions**: `play`, `pause`, `resume`, `stop`, `togglePlayPause`, `nextTrack`, `previousTrack`, `seek`, `setVolume`, `toggleMute`, `loadPlaylist`, `addToQueue`, `insertNext`, `removeFromQueue`, `clearQueue`.
- **Modes**: `repeatMode` (`off`/`one`/`all`), `shuffleMode` с `shuffleWithCurrentItem`.
- **Navigation**: `previousTrack` перезапускает трек если `currentTime > 3s`; `nextTrack` при `repeatMode === 'all'` зацикливает очередь; `handleTrackEnded` при `repeatMode === 'one'` перезапускает текущий.
- **Persistence**: `volume`, `repeatMode`, `shuffleMode` сохраняются в `localStorage`.
- **Keyboard controls**: Space (play/pause), стрелки (seek ±5s, volume ±0.1), M (mute), N (next), P (previous) — с защитой от срабатывания в input/textarea.
- **Hooks**: одинаковый набор — `usePlayerControls`, `usePlaybackState`, `useCurrentTrack`, `usePlaybackProgress`, `useVolumeControl`, `useQueue`, `useQueueControls`, `usePlaybackModes`, `useTrackPlayer`, `useTrackPlaybackState`, `useTrackProgress`, `useTrackNavigation`, `usePlayerKeyboardControls`.
- **Types**: `Track`, `PlayerState`, `PlaybackState`, `RepeatMode`, `TrackPlaybackState`, `TrackProgress`, `FormattedTime` — идентичны.

Отличие — в способе реализации (см. [раздел 3.10](#310-player-архитектурные-отличия)), не в функциональности.

---

## 3. Актуальные расхождения

### 3.1 Routing: lyrics path + OAuthRedirect

- **RTK:** маршрут lyrics — `/tracks/lyrics/:id` (через `Paths.TracksLyrics`). OAuthRedirect — вложен в `<Layout />`.
- **TanStack:** маршрут lyrics — `/tracks/:id/lyrics`. OAuthRedirect — вынесен на верхний уровень (вне `<Layout />`).

Оба приложения работоспособны, но 1:1 parity по URL-формату отсутствует.

### 3.2 MyLikedPlaylistsTab: owner actions отсутствуют в TanStack

- **RTK:** карточки включают owner actions (edit/delete dropdown через `DropdownMenu`).
- **TanStack:** карточки показывают `ReactionButtons` (like/dislike), owner/date/tracksCount, но без edit/delete dropdown.

Осознанное UX-расхождение.

### 3.3 MainPage / PlaylistsPage: owner actions на карточках

- **RTK:** на обеих страницах для своих плейлистов отображается `PlaylistActions` (edit/delete) через проверку `isOwnPlaylist`.
- **TanStack MainPage:** `PlaylistMainPageCard` отображает только `ReactionButtons`, без owner actions.
- **TanStack PlaylistsPage:** `PlaylistItem` отображает только `ReactionButtons`, без owner actions.

В TanStack owner actions на карточках доступны только в `PlaylistsTab` (UserPage) через prop `canEdit`.

### 3.4 PlaylistPage ControlPanel: Delete action

- **RTK:** dropdown содержит только Edit.
- **TanStack:** dropdown содержит Edit и Delete (через `useDeletePlaylistAction`).

### 3.5 UserPage: conditional rendering контента

- **RTK:** `UserInfo` и `UserTabs` рендерятся только когда `dominantColor` получен (`{dominantColor && ...}`).
- **TanStack:** `UserInfo` и `UserTabs` рендерятся всегда, `dominantColor` используется только для фона с fallback `'var(--color-bg-primary)'`.

Функционально оба варианта корректны, но UX при загрузке отличается.

### 3.6 PlaylistsPage: token gate

- В TanStack в `PlaylistsPage` применена project-specific проверка наличия токенов через raw `localStorage` keys (`musicfun-access-token`, `musicfun-refresh-token`).
- В RTK такой логики нет.

Проектное техническое отличие для гейтинга initial me-запроса.

### 3.7 Create/Edit Track Modal: различия в функционале

- **RTK `CreateEditTrackModal`:** расширенная форма — выбор плейлистов (`ChoosePlaylistButtonAndModal`), теги (`PlaylistTagAutocomplete`), артисты (`ArtistsTagAutocomplete`), releaseDate, 2-step flow (upload file → fill form).
- **TanStack `CreateTrackModal`:** упрощённая форма — title, lyrics, file upload, cover upload. Нет: выбора плейлистов, тегов, артистов, releaseDate.

Существенное расхождение в возможностях при создании/редактировании треков.

### 3.8 Track data в таблицах: hardcoded vs API

- **RTK:** в TracksTab, LikedTracksTab, TracksPage, PlaylistPage используются `artists: ['Artist 1', 'Artist 2']` и `duration: 100` (hardcoded).
- **TanStack:** читает реальных артистов из `included` (через `getArtistsByTrack`) и duration из API с fallback `0`.

TanStack ближе к реальным данным; RTK использует заглушки.

### 3.9 Player widget: TanStack виджет не подключён к store

- **RTK `Player` widget** (`widgets/Player/Player.tsx`): полностью подключён к player store.
  - Отображает cover/title/artist из `useCurrentTrack()` с fallback на первый трек из API (`useFetchTracksQuery`).
  - Показывает `AudioPlayerSkeleton` во время загрузки API.
  - Передаёт в `AudioPlayer` все controls: `onTogglePlay`, `onNext`, `onPrevious`, `onShuffle`, `onRepeat`, `onTimeSeek`, `onVolumeSet`, `duration`, `currentTime`, `volume`.
- **TanStack `Player` widget** (`widgets/Player/Player.tsx`): **заглушка**.
  - Не подключён к `usePlayerStore` — использует локальный `useState` для shuffle/repeat.
  - Нет cover, title, artist, progress bar, volume.
  - Все callbacks — пустые: `onNext={() => {}}`, `onPrevious={() => {}}`.
  - Нет skeleton при загрузке.

Существенное расхождение: в TanStack player store полностью реализован и работает (подключён на страницах), но виджет плеера в Layout остался неподключённым.

### 3.10 Player: архитектурные отличия

При идентичном наборе функциональности, реализация отличается:

- **State management**: RTK — Redux Toolkit slice (`playerSlice.ts`) + `createSelector`; TanStack — Zustand store (`player-store.ts`) + inline selectors.
- **Audio bridge**: RTK — Redux middleware (`playerMiddleware.ts`), перехватывает actions и синхронизирует с глобальным `new Audio()`; TanStack — `AudioManager` singleton класс с типизированным EventEmitter и инкапсулированным `Audio()`.
- **Track loading**: RTK — `audio.src = url` + `audio.play()` в middleware; TanStack — `audioManager.loadTrack(track)` возвращает `Promise` с `canplay`/`error`/timeout (30s).
- **Default repeat mode**: RTK — `'one'`; TanStack — `'off'`.
- **Time throttling**: RTK — custom `throttle()` (1000ms); TanStack — delta-based (`> 0.5s`).
- **Buffered progress**: RTK трекает `buffered` через audio `progress` event; TanStack не обновляет `buffered`.
- **Store persistence**: RTK — ручное сохранение в `localStorage`; TanStack — Zustand `persist` middleware (декларативно).
- **Navigation utils**: TanStack выносит `getNextTrackId`/`getPreviousTrackId`/`getQueuePosition` в отдельный `track-navigation.ts`; RTK вычисляет inline в selectors.

Эти отличия архитектурные и обусловлены разными стеками (Redux vs Zustand). На UX не влияют.

---

## 4. Вывод

С момента последней проверки (2026-02-24) закрыты два важных расхождения: `Pagination` и `tab switch page-reset` теперь идентичны.

Основные несоответствия:

1. формат lyrics-route URL и расположение OAuthRedirect;
2. отсутствие owner actions (edit/delete) на карточках плейлистов в TanStack (`MainPage`, `PlaylistsPage`, `MyLikedPlaylistsTab`);
3. TanStack `PlaylistPage` ControlPanel имеет Delete action, RTK — нет;
4. conditional rendering контента на `UserPage` (ожидание `dominantColor` в RTK);
5. проектно-специфичная token-gate логика в TanStack `PlaylistsPage`;
6. существенное расхождение в Create/Edit Track Modal (RTK значительно богаче);
7. RTK использует hardcoded artists/duration в таблицах, TanStack — реальные данные из API;
8. Player widget в TanStack — заглушка (не подключён к store), в RTK — полностью функциональный.
