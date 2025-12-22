import { matchPath, useLocation } from 'react-router'

import { Paths } from '@/shared/configs'

export const useCurrentPage = () => {
  const location = useLocation()

  const isMainPage = matchPath({ path: Paths.Main }, location.pathname)
  const isTracksPage = matchPath({ path: Paths.Tracks }, location.pathname)
  const isTrackPage = matchPath({ path: `${Paths.Tracks}/:id` }, location.pathname)
  const isTrackLyricsPage = matchPath({ path: `${Paths.TracksLyrics}/:id` }, location.pathname)
  const isPlaylistsPage = matchPath({ path: Paths.Playlists }, location.pathname)
  const isPlaylistPage = matchPath({ path: `${Paths.Playlists}/:id` }, location.pathname)
  const isUserPage = matchPath({ path: `${Paths.Profile}/:userId` }, location.pathname)

  return {
    isMainPage: !!isMainPage,
    isTracksPage: !!isTracksPage,
    isTrackPage: !!isTrackPage,
    isTrackLyricsPage: !!isTrackLyricsPage,
    isPlaylistsPage: !!isPlaylistsPage,
    isPlaylistPage: !!isPlaylistPage,
    isUserPage: !!isUserPage,
  }
}
