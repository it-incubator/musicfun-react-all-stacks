import { useParams } from 'react-router'
import { useMeQuery } from '@/features/auth/api/use-me.query'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { useTracks } from '@/features/tracks/api/use-tracks.query'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
  PathsPlaylistsTracksGetParametersQuerySortBy,
  PathsPlaylistsTracksGetParametersQueryPaginationType,
  type SchemaGetTracksRequestPayload,
} from '@/shared/api/schema'

export const useUserPageData = () => {
  const { id: userId } = useParams<{ id: string }>()
  const { data: me, isLoading: isMeLoading } = useMeQuery()
  const isProfileOwner = me?.userId === userId

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = usePlaylists({
    userId: userId,
    pageSize: 1, // Just to get totalCount and first item for login hack
  })

  const { data: tracksResponse, isLoading: isTracksLoading } = useTracks({
    userId: userId,
    pageNumber: 1,
    pageSize: 1,
    sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
    includeDrafts: isProfileOwner,
    paginationType: PathsPlaylistsTracksGetParametersQueryPaginationType.offset,
  } as SchemaGetTracksRequestPayload)

  let userLogin = isProfileOwner ? me?.login : ''

  if (!isProfileOwner && playlistsResponse?.data?.data?.[0]) {
    userLogin = playlistsResponse.data.data[0].attributes.user.name
  }

  if (!isProfileOwner && !userLogin && tracksResponse?.data?.data?.[0]) {
    userLogin = tracksResponse.data.data[0].attributes.user.name
  }

  return {
    userId,
    pageOwnerId: userId,
    isProfileOwner,
    userLogin,
    playlistsCount: playlistsResponse?.data?.meta.totalCount || 0,
    tracksCount: tracksResponse?.data?.meta.totalCount || 0,
    isInitialLoading: isMeLoading || isPlaylistsLoading || isTracksLoading,
    isContentLoading: isPlaylistsLoading || isTracksLoading || isMeLoading,
    isMeQuerySuccess: !isMeLoading,
    me,
  }
}
