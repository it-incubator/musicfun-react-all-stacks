import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { useFetchTracksQuery } from '@/features/tracks'

export const useGetUserPageData = () => {
  const { data: user, isLoading } = useMeQuery()
  const { userId: pageOwnerId } = useParams()
  const isProfileOwner = user?.userId === pageOwnerId

  const { data: tracks } = useFetchTracksQuery(
    {
      pageSize: 10,
      pageNumber: 1,
      userId: pageOwnerId,
      includeDrafts: isProfileOwner ? true : undefined,
    },
    { skip: isLoading }
  )

  const { data: playlists } = useFetchPlaylistsQuery(
    {
      userId: pageOwnerId,
    },
    { skip: isLoading }
  )

  const nameFromTracksOrPlaylists = tracks?.data[0]
    ? tracks?.data[0].attributes.user.name
    : playlists?.data[0]
      ? playlists.data[0].attributes.user.name
      : ''

  const userName: string = isProfileOwner ? (user ? user.login : '') : nameFromTracksOrPlaylists

  return { isProfileOwner, userName, tracks, playlists }
}
