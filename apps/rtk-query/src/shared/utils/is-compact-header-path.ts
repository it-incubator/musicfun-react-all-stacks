import { matchPath } from 'react-router'
import { Paths } from '@/shared/configs'

/**
 * Checks whether the current route should use the "compact" header/layout variant.
 *
 * Compact variant is enabled for detail pages (entities by id) like:
 * - Track page:       `${Paths.Tracks}/:id`
 * - Track lyrics page:`${Paths.TracksLyrics}/:id`
 * - Playlist page:    `${Paths.Playlists}/:id`
 * - User page:        `${Paths.Profile}/:userId`
 *
 * @param pathname Current location pathname (e.g. "/tracks/123").
 * @returns `true` if pathname matches a compact variant route, otherwise `false`.
 */
export const isCompactHeaderPath = (pathname: string): boolean =>
  Boolean(
    matchPath({ path: `${Paths.Tracks}/:id` }, pathname) ||
      matchPath({ path: `${Paths.TracksLyrics}/:id` }, pathname) ||
      matchPath({ path: `${Paths.Playlists}/:id` }, pathname) ||
      matchPath({ path: `${Paths.Profile}/:userId` }, pathname)
  )
