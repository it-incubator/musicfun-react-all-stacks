# TODO: Features

## Актуальные статусы (проверка кода от 2026-02-23)

Ниже — фактический статус задач в `tanstack-query-zustand` относительно RTK-референса.

## Закрытые задачи последнего цикла

- [x] **UserPage: background color extraction как в RTK**

  - ✅ В `useUserPageBackgroundColor` подключён avatar из profile store + `decodeFileFromBase64`.
  - ✅ Логика вычисления dominant color приведена к RTK-подходу (для owner-профиля).

- [x] **UserPage tabs: pagination через URL как в RTK**

  - ✅ `PlaylistsTab`, `TracksTab`, `LikedTracksTab`, `MyLikedPlaylistsTab` переведены с `useState(pageNumber)` на `searchParams(page)`.
  - ✅ Восстановление состояния страницы после reload/back-forward теперь работает через URL.

- [x] **UserPage > MyLikedPlaylistsTab: owner actions parity**

  - ✅ Для карточек в табе включены owner actions (edit/delete) через `canEdit`.

- [x] **PlaylistPage tracks: унифицирован fallback для duration**

  - ✅ До исправления API выставлен единый с RTK fallback (`duration: 100`).

- [x] **PlaylistsPage (tanstack): project-specific token gate**
  - ✅ Проверка наличия токенов оставлена через raw `localStorage` ключи (`musicfun-access-token`, `musicfun-refresh-token`).
  - ✅ Это осознанная проектная реализация для `tanstack-query-zustand` (гейт для initial me-запроса, а не token lifecycle API).

### Критично: паритет поведения

- [x] **TracksPage (tanstack): воспроизведение и очередь как в RTK**

  - ✅ Добавлен toggle play/pause для текущего трека.
  - ✅ Добавлен запуск с `playlistId = all-tracks` и полной очередью.
  - ✅ Добавлено дописывание новых треков в queue при infinite scroll, если активен `all-tracks`.

- [x] **UserPage > TracksTab / LikedTracksTab (tanstack): playback**
  - ✅ Подключён реальный `onPlayClick` в обоих табах.
  - ✅ Добавлены play/pause/resume для текущего трека.
  - ✅ Добавлена загрузка/использование playlist queue для табов.

### Паритет UI/flows

- [x] **TrackActions (tanstack): Edit track**

  - ✅ Реализован prefill в modal по `editingTrackId`.
  - ✅ Реализован `PUT /playlists/tracks/{trackId}` при сохранении.

- [x] **TrackPage (tanstack): кнопка Play в ControlPanel**

  - ✅ Подключён обработчик Play/Pause для текущего трека.

- [x] **PlaylistPage (tanstack): Edit playlist из ControlPanel**

  - ✅ Реализован prefill в modal по `editingPlaylistId`.
  - ✅ Реализован `PUT /playlists/{playlistId}` при сохранении.

- [x] **PlaylistCard (tanstack): Edit в карточке**

  - ✅ Использует тот же рабочий edit-flow через `editingPlaylistId` + update mutation.

- [x] **UserPage (tanstack): редактирование профиля (как в RTK)**

  - ✅ Подключён `EditProfileModal` через `Layout`.
  - ✅ Подключена гидрация profile state из `localStorage` по текущему пользователю.
  - ✅ Кнопка `Edit profile` в `UserInfo` открывает модалку и сохраняет изменения в `profile-store`.

- [x] **Header (tanstack): поведение AccountMenu как в RTK**

  - ✅ В хедере добавлен skeleton для auth-action блока во время `me` loading.
  - ✅ `ProfileDropdownMenu` использует `avatar/fullName/login` и fallback-логику имени как в RTK.
  - ✅ На logout выполняется очистка `profile-store`.

- [x] **UserPage tabs (tanstack): активный таб сохраняется в URL**
  - ✅ Текущий таб берётся из `?tab=...`.
  - ✅ При переключении таба URL обновляется.
  - ✅ После reload восстанавливается актуальный таб.

### UX / данные / скелетоны (частичный паритет)

- [x] **UserPage (tanstack): реальный avatar вместо hardcoded**

  - ✅ Убран hardcoded `unsplash` в `UserInfo` и `Header`.
  - ✅ Добавлен общий `Avatar` компонент с fallback инициалов (как в RTK-подходе).
  - ℹ️ API `/auth/me` не возвращает avatar URL, поэтому используется корректный fallback без фиктивной картинки.

- [x] **UserPage (tanstack): skeleton в табах при initial loading**

  - ✅ Вместо `null` добавлен `UserTabsSkeleton`.

- [x] **TrackPage / PlaylistPage (tanstack): skeleton parity**

  - ✅ Добавлены `TrackPageSkeleton` и `PlaylistPageSkeleton`.

- [x] **TrackPage / PlaylistPage (tanstack): background color extraction parity**

  - ✅ Подключён `usePageBackgroundColor` на обеих страницах (`canvasRef` + `backgroundColor`).

- [x] **PlaylistPage (tanstack): поиск по трекам в таблице**

  - ✅ Добавлен `SearchTextField` и фильтрация треков по названию.
  - ✅ При поиске queue/play-all работают от отфильтрованного списка.

- [x] **TracksPage (tanstack): синхронизация selected sort с URL**

  - ✅ Значение `SortSelect` вычисляется из `sortBy/sortDirection` из URL.

- [x] **UserPage tracks data (tanstack): заглушки убраны**
  - ✅ Значения `duration`/`dislikesCount` читаются из API с fallback.
  - ✅ Жёстко прописанные mock-значения в `UserPage` табах устранены.
