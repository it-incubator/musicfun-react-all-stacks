import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'

import { TracksTable } from '@/features/tracks'
import { useTracks } from '@/features/tracks/api/use-tracks.query.ts'
import { CreateTrackModal } from '@/features/tracks/ui/CreateTrackForm/CreateTrackModal'
import { TrackRowContainer } from '@/features/tracks/ui/TrackRowContainer/TrackRowContainer'
import {
  PathsPlaylistsGetParametersQuerySortDirection,
  PathsPlaylistsTracksGetParametersQueryPaginationType,
  PathsPlaylistsTracksGetParametersQuerySortBy,
  type SchemaGetTracksRequestPayload,
} from '@/shared/api/schema.ts'
import { Button, Pagination } from '@/shared/components'
import { useUIStore } from '@/shared/model/ui-store'
import { useUserPageData } from '../../../hooks'
import { useCurrentTrack, usePlaybackProgress } from '@/player'
import { usePlaybackState, usePlayerControls } from '@/player'
import { getArtistsByTrack } from '@/shared/utils'
import { convertApiTrackToPlayerTrack, convertApiTracksToPlayerTracks } from '@/player'
import { usePlayerStore } from '@/player/model/player-store.ts'

import s from './TracksTab.module.css'

const PAGE_SIZE = 5
const DEFAULT_PAGE = 1

export const TracksTab = () => {
  const { t } = useTranslation()
  const { id: userId } = useParams<{ id: string }>()
  const { isProfileOwner } = useUserPageData()
  const [searchParams, setSearchParams] = useSearchParams()

  const { isCreateTrackModalOpen, openCreateTrackModal, closeCreateTrackModal } = useUIStore()

  const pageNumber = Number(searchParams.get('page')) || DEFAULT_PAGE

  const { track: currentTrack } = useCurrentTrack()
  const { currentTime } = usePlaybackProgress()
  const { isPlaying } = usePlaybackState()
  const { play, pause, resume } = usePlayerControls()
  const currentPlaylistId = usePlayerStore((state) => state.currentPlaylistId)

  const queryParams = useMemo<SchemaGetTracksRequestPayload>(
    () => ({
      pageNumber,
      pageSize: PAGE_SIZE,
      sortBy: PathsPlaylistsTracksGetParametersQuerySortBy.publishedAt,
      sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
      userId: userId || undefined,
      includeDrafts: isProfileOwner,
      paginationType: PathsPlaylistsTracksGetParametersQueryPaginationType.offset,
    }),
    [pageNumber, userId, isProfileOwner]
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
  const userTracksPlaylistId = `${userId || 'unknown'}-user-tracks`

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
      if (currentPlaylistId !== userTracksPlaylistId) {
        play(playerTrack, userTracksPlaylistId, playerTracks)
        return
      }

      play(playerTrack, userTracksPlaylistId)
    },
    [
      currentPlaylistId,
      currentTrack?.id,
      isPlaying,
      pause,
      play,
      playerTracks,
      resume,
      tracks,
      userTracksPlaylistId,
    ]
  )

  return (
    <>
      {isProfileOwner && (
        <Button className={s.uploadTrackButton} onClick={() => openCreateTrackModal()}>
          {t('tracks.button.upload_track')}
        </Button>
      )}

      {isCreateTrackModalOpen && <CreateTrackModal onClose={closeCreateTrackModal} />}

      {isError && <div>{t('tracks.label.load_error')}</div>}
      {!isLoading && !isError && tracks.length > 0 && (
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
      )}

      {!isLoading && !isError && (
        <Pagination
          page={pageNumber}
          pagesCount={Math.max(1, totalPages)}
          onPageChange={handlePageChange}
          alwaysVisible
        />
      )}
    </>
  )
}
