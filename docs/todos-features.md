# TODO: Features

## Актуальные статусы (проверка кода от 2026-02-20)

Ниже — фактический список незавершённых или частично незавершённых задач в `tanstack-query-zustand` относительно RTK-референса.

### Критично: паритет поведения

- [ ] **TracksPage (tanstack): воспроизведение и очередь как в RTK**

  - Сейчас есть запуск `play(track)`, но нет полного паритета с RTK по `all-tracks` queue / дополняемой очереди при infinite scroll / toggle play-pause текущего трека.

- [ ] **UserPage > TracksTab / LikedTracksTab (tanstack): playback**
  - В табах треков остаётся `onPlayClick={() => {}}` (playback не подключён).

### Важные незавершённые действия

- [ ] **TrackActions (tanstack): Edit track**

  - В `TrackActions` остаётся `onEdit={() => {}}`.

- [ ] **TrackPage (tanstack): кнопка Play в ControlPanel**

  - Кнопка рендерится, но обработчик воспроизведения не подключён.

- [ ] **PlaylistPage (tanstack): Edit playlist из ControlPanel**

  - В owner dropdown пункт Edit с пустым обработчиком.

- [ ] **PlaylistCard (tanstack): Edit в карточке**
  - В dropdown карточки плейлиста пункт Edit без обработчика.

### UX / данные / скелетоны (частичный паритет)

- [ ] **UserPage (tanstack): реальный avatar вместо hardcoded**

  - В `UserInfo` используется `https://unsplash.it/192/192`.

- [ ] **UserPage (tanstack): skeleton в табах при initial loading**

  - Сейчас `UserTabs` возвращает `null` при `isInitialLoading`.

- [ ] **TrackPage / PlaylistPage (tanstack): skeleton parity**

  - Используется текст `common.loading` вместо отдельных skeleton-страниц.

- [ ] **TrackPage / PlaylistPage (tanstack): background color extraction parity**

  - В RTK используется `usePageBackgroundColor`; в tanstack на этих страницах нет паритета.

- [ ] **PlaylistPage (tanstack): поиск по трекам в таблице**

  - В RTK есть `SearchTextField` + фильтрация треков; в tanstack это отсутствует.

- [ ] **TracksPage (tanstack): синхронизация selected sort с URL**

  - Локальный `sort` и URL-параметры могут расходиться при прямом заходе по ссылке с query params.

- [ ] **UserPage tracks data (tanstack): частичные заглушки**
  - В `TracksTab` и `LikedTracksTab` остаются `duration: 0` и `dislikesCount: 0`.
