import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { useFetchTracksQuery } from '@/features/tracks'

export const useOwnerData = () => {
  const { data: user, isLoading: isMeLoading } = useMeQuery()
  const { userId: pageOwnerId } = useParams()
  const isProfileOwner = user?.userId === pageOwnerId

  const { data: tracksResponse, isLoading: isTracksLoading } = useFetchTracksQuery(
    {
      pageSize: 1,
      pageNumber: 1,
      userId: pageOwnerId,
    },
    { skip: isMeLoading || !pageOwnerId }
  )

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery(
    { userId: pageOwnerId, pageSize: 1 },
    { skip: isMeLoading || !pageOwnerId }
  )

  let userLogin = isProfileOwner ? user?.login : ''

  if (!isProfileOwner && playlistsResponse?.data?.[0]) {
    userLogin = playlistsResponse.data[0].attributes.user.name
  }

  if (!isProfileOwner && !userLogin && tracksResponse?.data?.[0]) {
    userLogin = tracksResponse.data[0].attributes.user.name
  }

  return {
    isProfileOwner,
    userLogin,
    playlistsCount: playlistsResponse?.meta.totalCount || 0,
    tracksCount: tracksResponse?.meta.totalCount || 0,
    isInitialLoading: isMeLoading || isPlaylistsLoading || isTracksLoading,
    isContentLoading: isPlaylistsLoading || isTracksLoading || isMeLoading,
    isMeQuerySuccess: !isMeLoading,
    pageOwnerId,
  }
}
