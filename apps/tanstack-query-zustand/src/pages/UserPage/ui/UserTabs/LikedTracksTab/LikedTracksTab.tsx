import { useCallback, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'

import { TracksTable } from '@/features/tracks'
import { useTracks } from '@/features/tracks/api/use-tracks.query'
import { TrackRowContainer } from '@/features/tracks/ui/TrackRowContainer/TrackRowContainer'
import {
  PathsPlaylistsGetParametersQuerySortDirection,
  PathsPlaylistsTracksGetParametersQueryPaginationType,
  PathsPlaylistsTracksGetParametersQuerySortBy,
} from '@/shared/api/schema'
import { Pagination } from '@/shared/components'
import {
  convertApiTrackToPlayerTrack,
  convertApiTracksToPlayerTracks,
  useCurrentTrack,
  usePlaybackProgress,
  usePlaybackState,
  usePlayerControls,
} from '@/player'
import { getArtistsByTrack } from '@/shared/utils'
import { usePlayerStore } from '@/player/model/player-store.ts'
import { useUserPageData } from '../../../hooks'

const PAGE_SIZE = 5
const DEFAULT_PAGE = 1

export const LikedTracksTab = () => {
  const { t } = useTranslation()
  const { id: userId } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isProfileOwner } = useUserPageData()

  const pageNumber = Number(searchParams.get('page')) || DEFAULT_PAGE

  const { track: currentTrack } = useCurrentTrack()
  const { currentTime } = usePlaybackProgress()
  const { isPlaying } = usePlaybackState()
  const { play, pause, resume } = usePlayerControls()
  const currentPlaylistId = usePlayerStore((state) => state.currentPlaylistId)

  const queryParams = useMemo(
    () => ({
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
      sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      userId: userId,
      includeDrafts: isProfileOwner,
      paginationType: PathsPlaylistsTracksGetParametersQueryPaginationType.offset,
    }),
    [isProfileOwner, pageNumber, userId]
  )

  const { data, isLoading, isError } = useTracks(queryParams)
  const tracks = data?.data?.data ?? []
  const included = data?.data?.included ?? []
  const totalPages = data?.data?.meta.pagesCount ?? 1

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)

        if (page === DEFAULT_PAGE) {
          next.delete('page')
        } else {
          next.set('page', page.toString())
        }

        return next
      })
    },
    [setSearchParams]
  )

  const playerTracks = useMemo(() => convertApiTracksToPlayerTracks(tracks), [tracks])
  const likedTracksPlaylistId = `${userId || 'unknown'}-liked-tracks`

  const handlePlayTrack = useCallback(
    (trackId: string) => {
      const track = tracks.find((item) => item.id === trackId)
      if (!track) return

      if (currentTrack?.id === trackId) {
        if (isPlaying) {
          pause()
        } else {
          resume()
        }
        return
      }

      const playerTrack = convertApiTrackToPlayerTrack(track)
      if (currentPlaylistId !== likedTracksPlaylistId) {
        play(playerTrack, likedTracksPlaylistId, playerTracks)
        return
      }

      play(playerTrack, likedTracksPlaylistId)
    },
    [
      currentPlaylistId,
      currentTrack?.id,
      isPlaying,
      likedTracksPlaylistId,
      pause,
      play,
      playerTracks,
      resume,
      tracks,
    ]
  )

  if (isLoading) return null
  if (isError) return <div>{t('tracks.label.load_error')}</div>

  return (
    <>
      <TracksTable
        trackRows={tracks.map((track, index) => ({
          index,
          id: track.id,
          title: track.attributes.title,
          image: track.attributes.images.main?.[0]?.url,
          addedAt: track.attributes.addedAt,
          artists: getArtistsByTrack(track as any, included as any).split(', '),
          duration: Number((track.attributes as any).duration ?? 0),
          likesCount: track.attributes.likesCount,
          dislikesCount: Number((track.attributes as any).dislikesCount ?? 0),
          currentUserReaction: track.attributes.currentUserReaction,
          ownerId: track.attributes.user.id,
          isPublished: track.attributes.isPublished,
        }))}
        renderTrackRow={(trackRow) => (
          <TrackRowContainer
            key={trackRow.id}
            trackRow={trackRow}
            currentTrack={currentTrack}
            currentTime={currentTime}
            onPlayClick={handlePlayTrack}
          />
        )}
      />
      <Pagination
        page={pageNumber}
        pagesCount={Math.max(1, totalPages)}
        onPageChange={handlePageChange}
        alwaysVisible
      />
    </>
  )
}
