# TODO: Features

## Актуальные статусы (проверка кода от 2026-03-12)

Ниже — фактический статус задач в `tanstack-query-zustand` относительно RTK-референса.

## Обратите внимание ⚠

---

> [!NOTE]
> Необходимо указать актуальное значение поля **duration**, если бэкэндер дописал логику для этого поля у списка треков.

> [!NOTE]
> Если бэкэндер реализовал возможность получения треков либо плейлистов со статусом **лайкнутое**, это необходимо отобразить в соответствующих табах UserPage.

> [!NOTE]
> Расположение `OAuthRedirect` отличается: в RTK — вложен внутрь `<Layout />`, в TanStack — вынесен на верхний уровень (вне `<Layout />`). Функционально оба варианта работают, но архитектурно отличается.

> [!NOTE] > **PlaylistsPage: token gate**
>
> - В TanStack в `PlaylistsPage` применена project-specific проверка наличия токенов через raw `localStorage` keys (`musicfun-access-token`, `musicfun-refresh-token`).
> - В RTK такой логики нет.-

---

## Открытые задачи

### Паритет UI/flows

- [ ] **MainPage / PlaylistsPage (tanstack): owner actions на карточках плейлистов как в RTK**

  - В RTK на `MainPage` и `PlaylistsPage` для своих плейлистов отображается `PlaylistActions` (edit/delete dropdown) через проверку `isOwnPlaylist(userId)`.
  - В TanStack `MainPage` использует `PlaylistMainPageCard` — только `ReactionButtons`, без owner actions.
  - В TanStack `PlaylistsPage` использует `PlaylistItem` — только `ReactionButtons`, без owner actions.
  - Owner actions в TanStack сейчас доступны только в `PlaylistsTab` (UserPage) через prop `canEdit`.
  - Нужно: добавить проверку `isOwnPlaylist` и отображение edit/delete dropdown (или передачу `canEdit`) на `MainPage` и `PlaylistsPage`.

- [ ] **PlaylistPage ControlPanel (tanstack): убрать Delete action, как в RTK**

  - В RTK `ControlPanel` (`PlaylistPage`) dropdown содержит только Edit (`handleOpenEditPlaylistModal`).
  - В TanStack `ControlPanel` dropdown содержит Edit и Delete (`useDeletePlaylistAction` + `DeleteIcon`).
  - Нужно: убрать Delete action из dropdown в TanStack `PlaylistPage/ControlPanel`, чтобы соответствовать RTK-референсу (только Edit).

- [ ] **UserPage (tanstack): conditional rendering — ждать dominantColor как в RTK**

  - В RTK `UserPage` содержимое (`UserInfo` + `UserTabs`) рендерится только когда `dominantColor` вычислен: `{dominantColor && (<>...</>)}`.
  - В TanStack `UserPage` рендерит `UserInfo` + `UserTabs` сразу, а `dominantColor` используется с fallback: `dominantColor || 'var(--color-bg-primary)'`.
  - Нужно: добавить условный рендеринг `{dominantColor && (...)}` в TanStack `UserPage`, чтобы не показывать контент до вычисления dominant color (как в RTK-референсе).

- [ ] **Create/Edit Track Modal (tanstack): расширить до уровня RTK**

  - В RTK `CreateEditTrackModal` форма содержит: `ImageUploader`, `TextField` (title), `ArtistsTagAutocomplete`, `PlaylistTagAutocomplete`, `Textarea` (lyrics), `ChoosePlaylistButtonAndModal` (привязка к плейлистам), `releaseDate`.
  - В TanStack `CreateTrackModal` форма содержит только: `ImageUploader`, `TextField` (title), `Textarea` (lyrics).
  - Отсутствуют: выбор артистов (`ArtistsTagAutocomplete`), тегов (`PlaylistTagAutocomplete`), привязка к плейлистам (`ChoosePlaylistButtonAndModal`), поле `releaseDate`.
  - Нужно: реализовать недостающие поля в TanStack `CreateTrackModal` с учётом стека (TanStack Query + Zustand вместо RTK), сохраняя функциональный паритет с RTK-референсом.

- [ ] **Track data в таблицах (RTK): заменить hardcoded artists/duration на реальные данные из API, как в TanStack**

  - В RTK `TracksPage`, `PlaylistPage`, `TracksTab`, `LikedTracksTab` при маппинге треков в `trackRows` используются заглушки: `artists: ['Artist 1', 'Artist 2']`, `duration: 100`.
  - В TanStack эти поля читаются из API: артисты через `getArtistsByTrack` (из `included`), duration из `track.attributes.duration` с fallback `0`.
  - Нужно: в RTK заменить hardcoded значения на реальные данные из API-ответа (аналогично тому, как это уже сделано в TanStack).

- [ ] **TracksPage (tanstack): иконка pause/play над обложкой трека не меняется при воспроизведении/остановке**

  - На странице `TracksPage` в `tanstack-query-zustand` приложении при воспроизведении / остановке трека иконка pause / play (которая над обложкой трека) не меняется.

- [ ] **Dropdown actions (tanstack): смещение разметки при клике на иконку «more» (три точки)**

  - В `tanstack-query-zustand` приложении в компоненте с дропдауном дополнительных опций трека / плейлиста при клике на иконку трёх точек (more), которая является триггером для открытия дропдауна, происходит смещение разметки.
  - В RTK Query приложении такого смещения нет — можно ориентироваться на RTK-реализацию для поиска и исправления проблемы.
  - Нужно: устранить смещение разметки при открытии дропдауна в TanStack.

- [ ] **TrackInfoCell (оба проекта): выровнять обложку и текст по центру**

  - В обоих приложениях в компоненте `TrackInfoCell` обложка и текст не выровнены.
  - Нужно: выстроить обложку и текст по центру в `TrackInfoCell` в обоих проектах.

- [ ] **TracksPage (tanstack): порядок треков в таблице отличается от RTK**

  - На странице `TracksPage` в TanStack Query приложении треки в таблице имеют иной порядок, чем на аналогичной странице в RTK Query приложении.
  - Нужно: выяснить причину расхождения порядка, сообщить о ней, предложить решение и, после подтверждения, устранить проблему.

- [ ] **Routing (RTK): lyrics path — привести к формату TanStack**

  - В RTK маршрут lyrics: `/tracks/lyrics/:id` (через `Paths.TracksLyrics`).
  - В TanStack маршрут lyrics: `/tracks/:id/lyrics`.
  - Нужно: в RTK изменить lyrics-route на `/tracks/:id/lyrics`, чтобы соответствовать TanStack-референсу.

### Player widget

- [ ] **Player widget (tanstack): подключить к store как в RTK**

  - Сейчас TanStack `Player` (`widgets/Player/Player.tsx`) — заглушка: локальный `useState` для shuffle/repeat, пустые callbacks `onNext={() => {}}`, нет cover/title/artist/progress/volume.
  - В RTK `Player` подключён к player store: `useCurrentTrack`, `usePlaybackModes`, `usePlaybackState`, `usePlayerControls`, `usePlaybackProgress`, `useVolumeControl`, показывает `AudioPlayerSkeleton` во время загрузки.
  - Нужно: подключить TanStack `Player` к `usePlayerStore` аналогично RTK — передавать в `AudioPlayer` все props: cover, title, artist, isPlaying, duration, currentTime, volume, все callbacks, skeleton.

- [ ] **Player widget (оба проекта): ограничить ширину текста track info до 280px**

  - Сейчас в `AudioPlayer` блок `.info` (title + artist) не ограничен по ширине — длинные названия могут ломать лейаут.
  - Нужно: добавить `max-width: 280px` + обрезку текста для title и artist. Реализацию сделать как в `TrackInfoCell` (`max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`), **либо** другим элегантным способом — LM при выполнении должна предложить варианты (например: CSS marquee-анимация, fade-out gradient, ellipsis) перед реализацией.
  - Сделать в обоих проектах.

- [ ] **Player widget (оба проекта): показывать артиста трека вместо имени загрузившего**

  - Сейчас в RTK `convertApiTrackToPlayerTrack` поле `artist` заполняется из `apiTrack.attributes.user?.name` (имя загрузившего), а не из `artists`.
  - Нужно: в обоих проектах показывать имя артиста трека, как это сделано в `TrackInfoCell` / `TrackCard` (через `artists.join(', ')`).

- [ ] **Player widget (оба проекта): размер обложки — как PlaylistRow на TrackPage**

  - Сейчас в `AudioPlayer` `.cover` имеет размер `112×112px`.
  - В `PlaylistRow` (список плейлистов на `TrackPage`) обложка — `52×52px`.
  - Нужно: привести размер обложки в Player widget к `52×52px`, чтобы соответствовать PlaylistRow. Сделать в обоих проектах.

- [ ] **Player widget (оба проекта): левый отступ обложки — как в Sidebar**

  - `Sidebar` имеет `padding: ... 30px ...` — это отступ от пунктов меню до левого края.
  - Нужно: установить `padding-left: 30px` для блока `.trackInfo` в `AudioPlayer`, чтобы обложка визуально выравнивалась с пунктами меню Sidebar. Сделать в обоих проектах.

---

## Закрытые задачи

### Закрытые задачи последнего цикла

- [x] **UserPage: background color extraction как в RTK**

  - ✅ В `useUserPageBackgroundColor` подключён avatar из profile store + `decodeFileFromBase64`.
  - ✅ Логика вычисления dominant color приведена к RTK-подходу (для owner-профиля).

- [x] **UserPage tabs: pagination через URL как в RTK**

  - ✅ `PlaylistsTab`, `TracksTab`, `LikedTracksTab`, `MyLikedPlaylistsTab` переведены с `useState(pageNumber)` на `searchParams(page)`.
  - ✅ Восстановление состояния страницы после reload/back-forward теперь работает через URL.

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
