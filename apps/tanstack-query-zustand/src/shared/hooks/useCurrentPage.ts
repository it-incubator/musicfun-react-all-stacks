import { useLocation } from 'react-router'

export const useCurrentPage = () => {
  const { pathname } = useLocation()

  const isTrackPage = pathname.includes('/tracks/')
  const isPlaylistPage = pathname.includes('/playlists/')

  return {
    isTrackPage,
    isPlaylistPage,
  }
}
