import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'

import { useMeQuery } from '@/features/auth'
import {
  TracksTable,
  TracksTableSkeleton,
  useFetchTracksByScrollInfiniteQuery,
} from '@/features/tracks'
import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { useCurrentTrack, usePlaybackState, usePlayerControls } from '@/player'
import { usePlayingTrackProgress, useQueueControls } from '@/player/playerHooks.ts'
import { convertApiTracksToPlayerTracks, convertApiTrackToPlayerTrack } from '@/player/utils.ts'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'
import { Spinner } from '@/shared/components/Spinner/Spinner.tsx'
import { useAppSelector } from '@/shared/hooks/useAppSelector.ts'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { PageWithHeader, SearchTags, SearchTextField, SortSelect } from '../common'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const { t } = useTranslation()

  const { track: currentTrack } = useCurrentTrack()
  const { isPlaying } = usePlaybackState()
  const {
    data: tracksData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useFetchTracksByScrollInfiniteQuery()
  const pages = tracksData?.pages.flatMap((p) => p.data) || []
  const { data: me } = useMeQuery()
  const { play, resume, pause } = usePlayerControls()
  const { loadPlaylist, addToQueue } = useQueueControls()
  const { playingTrackProgress } = usePlayingTrackProgress()
  const currentPlaylistId = useAppSelector((state) => state.player.currentPlaylistId)

  const handleTrackPlayClick = (trackId: string) => {
    const clickedTrack = pages.find((track) => track.id === trackId)

    if (!clickedTrack) {
      return
    }

    if (currentTrack?.id === trackId) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }

      return
    }

    const playerTrack = convertApiTrackToPlayerTrack(clickedTrack)
    const tracksForPlayer = convertApiTracksToPlayerTracks(pages)

    play(playerTrack, 'all-tracks', tracksForPlayer)
  }

  const { ref, inView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    // Handle infinite scroll loading
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }

    // Update player queue when new tracks are loaded
    if (tracksData?.pages) {
      const allTracks = tracksData.pages.flatMap((page) => page.data)
      const playerTracks = convertApiTracksToPlayerTracks(allTracks)

      if (playerTracks.length > 0) {
        if (currentPlaylistId === 'all-tracks') {
          // Playlist already exists, add new tracks
          // We need to get only newly added tracks
          if (tracksData.pages.length > 1) {
            const currentPageIndex = tracksData.pages.length - 1
            const newTracks = tracksData.pages[currentPageIndex].data
            const newPlayerTracks = convertApiTracksToPlayerTracks(newTracks)
            addToQueue(newPlayerTracks)
          }
        } else {
          // First load - initialize playlist
          loadPlaylist('all-tracks', playerTracks)
        }
      }
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    tracksData?.pages,
    addToQueue,
    loadPlaylist,
    currentPlaylistId,
  ])

  return (
    <PageWithHeader>
      <Typography variant="h2" as="h1" className={s.title}>
        {t('tracks.title.all_tracks')}
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField
            placeholder={t('tracks.placeholder.search_tracks')}
            onChange={() => {}}
          />
          <SortSelect onChange={() => {}} />
        </div>
        <div className={s.controlsRow}>
          <SearchTags type="tags" />
          <SearchTags type="artists" />
        </div>
      </div>

      {isLoading ? (
        <TracksTableSkeleton />
      ) : (
        <TracksTable
          trackRows={pages.map((track, index) => {
            const image = getImageByType(track.attributes.images, ImageType.MEDIUM)
            const userId = track.attributes.user.id
            const isOwner = userId === me?.userId

            return {
              index,
              id: track.id,
              title: track.attributes.title,
              imageSrc: image?.url || noCoverPlaceholder,
              addedAt: track.attributes.addedAt,
              artists: ['Artist 1', 'Artist 2'],
              duration: 100,
              likesCount: track.attributes.likesCount,
              dislikesCount: track.attributes.dislikesCount,
              currentUserReaction: track.attributes.currentUserReaction,
              url: track.attributes.attachments[0].url,
              isOwner,
            }
          })}
          renderTrackRow={(trackRow) => (
            <TrackRow
              playingTrackProgress={playingTrackProgress}
              key={trackRow.id}
              trackRow={trackRow}
              isPlaying={isPlaying && currentTrack?.id === trackRow.id}
              onTrackPlayClick={handleTrackPlayClick}
              renderActionsCell={() => (
                <TrackActions
                  reaction={trackRow.currentUserReaction}
                  likesCount={trackRow.likesCount}
                  trackId={trackRow.id}
                  isOwner={trackRow.isOwner}
                />
              )}
            />
          )}
        />
      )}

      {hasNextPage && (
        <div ref={ref}>
          {isFetchingNextPage ? <Spinner size={50} /> : <div style={{ height: '10px' }} />}
        </div>
      )}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </PageWithHeader>
  )
}
