# MusicFun: Feature Comparison (RTK Query vs TanStack Query + Zustand)

Проверка кода: **2026-02-24**  
Сравнивались:

- `apps/rtk-query`
- `apps/tanstack-query-zustand`

Цель документа: зафиксировать **актуальный** функциональный паритет и реальные расхождения по коду.

---

## 1. Краткий статус

| Блок                                    | Статус | Комментарий                                                                          |
| --------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| MainPage                                | ✅     | Базовый сценарий данных/карточек/playback синхронизирован                            |
| TracksPage                              | ✅     | Поиск/сортировка/playback/очередь синхронизированы                                   |
| TrackPage                               | ✅     | Skeleton, gradient, playback/control panel синхронизированы                          |
| PlaylistPage                            | ✅     | Skeleton, gradient, reactions, edit, fallback `duration: 100` синхронизированы       |
| UserPage core (profile/tabs/background) | ✅     | URL-tab sync, background extraction по avatar, skeleton логика есть                  |
| Header + account menu                   | ✅     | Поведение account menu и logout flow в рабочем паритете                              |
| Routing                                 | ⚠️     | Есть различие в path-шаблоне lyrics-route (см. ниже)                                 |
| UserPage: Liked Playlists tab           | ⚠️     | Контент/поведение отличается от RTK (см. ниже)                                       |
| Pagination behavior                     | ⚠️     | В TanStack `Pagination` теперь всегда видима, в RTK скрывается при `pagesCount <= 1` |

---

## 2. Что синхронизировано (актуально)

### 2.1 UserPage background color

- В TanStack `useUserPageBackgroundColor` использует `profile avatar -> decode base64 -> dominant color`, как RTK.
- Старый gap по этому блоку закрыт.

### 2.2 UserPage tabs + URL

- В TanStack таб берется из `?tab=...`, как в RTK.
- Вкладки используют `searchParams` для `page` и pagination state.

### 2.3 PlaylistPage duration

- В обоих проектах в таблице треков плейлиста используется временный fallback `duration: 100` до фикса API.

### 2.4 Edit profile flow

- В обоих проектах есть modal flow редактирования профиля, сохранение в `localStorage`-профиль, обновление avatar/fullName в состоянии приложения.
- В TanStack есть crop-step при загрузке изображения.

### 2.5 Header / account menu

- В обоих проектах:
  - skeleton в auth action-зоне при `me` loading;
  - отображение avatar/fullName/login;
  - переход в профиль;
  - logout.

---

## 3. Актуальные расхождения

### 3.1 Routing: lyrics path differs

- **RTK:** маршрут трека с лирикой — `/tracks/lyrics/:id` (через `Paths.TracksLyrics`).
- **TanStack:** маршрут — `/tracks/:id/lyrics`.

Оба приложения работоспособны в пределах своего роутинга, но 1:1 parity по URL-формату отсутствует.

### 3.2 MyLikedPlaylistsTab: поведение отличается от RTK

- **RTK:** карточки во вкладке включают owner actions (edit/delete dropdown).
- **TanStack:** вкладка приведена к карточке main-page типа (reactions + owner/date/tracks), но без owner edit/delete actions.

Это осознанное UX-расхождение относительно RTK-референса.

### 3.3 Pagination component behavior

- **RTK `Pagination`:** `return null` при `pagesCount <= 1`.
- **TanStack `Pagination`:** после текущих правок компонент рендерится всегда (нормализация до минимум 1 страницы).

Это глобальное различие поведения компонента, не только в UserPage табах.

### 3.4 Tab switch page-reset behavior

- **TanStack `UserTabs`:** при переключении таба удаляется `page` из query.
- **RTK `UserTabs`:** `page` не сбрасывается при смене таба.

Поведение отличается, хотя оба варианта функционально корректны.

### 3.5 PlaylistsPage token gate implementation

- В TanStack в `PlaylistsPage` применена project-specific проверка наличия токенов через raw localStorage keys.
- В RTK такой логики gate нет в этом месте.

Это проектное техническое отличие, а не критический UX-breaker.

---

## 4. Вывод

На уровне пользовательских сценариев проекты сейчас близки к высокому паритету.  
Основные несоответствия локализованы в:

1. формате lyrics-route URL;
2. содержимом/действиях в `MyLikedPlaylistsTab`;
3. глобальном поведении компонента `Pagination`;
4. деталях query-param поведения при переключении табов;
5. проектно-специфичной token-gate логике в TanStack `PlaylistsPage`.
