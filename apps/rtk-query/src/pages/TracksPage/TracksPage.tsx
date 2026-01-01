import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'

import { useMeQuery } from '@/features/auth'
import {
  TracksTable,
  useFetchTracksByScrollInfiniteQuery,
  useLazyFetchTrackByIdQuery,
} from '@/features/tracks'
import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import {
  playTrack,
  selectCurrentTime,
  selectDuration,
  setLoadingState,
  type Track,
  useCurrentTrack,
  usePlaybackState,
} from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'
import { Spinner } from '@/shared/components/Loader/Spinner.tsx'
import { useAppDispatch } from '@/shared/hooks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { PageWithHeader, SearchTags, SearchTextField, SortSelect } from '../common'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const { t } = useTranslation()

  const [fetchTrack] = useLazyFetchTrackByIdQuery()
  const { track: currentTrack } = useCurrentTrack()
  const { isPlaying } = usePlaybackState()
  const {
    data: tracksData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchTracksByScrollInfiniteQuery()
  const pages = tracksData?.pages.flatMap((p) => p.data) || []
  const { data: me } = useMeQuery()
  const dispatch = useAppDispatch()

  const handleTrackPlayClick = async (trackId: string) => {
    if (currentTrack?.id === trackId) {
      // Logic for play/pause on the same track can be handled by the player itself
      return
    }

    dispatch(setLoadingState(true))
    try {
      const result = await fetchTrack({ trackId }).unwrap()

      if (result.data) {
        const playerTrack: Track = {
          id: result.data.id,
          title: result.data.attributes.title,
          artist: result.data.attributes.artists[0]?.name || 'Unknown Artist',
          duration: result.data.attributes.duration,
          url: result.data.attributes.attachments[0]?.url || '',
          albumArt: result.data.attributes.images?.main?.[0]?.url,
        }
        dispatch(playTrack({ track: playerTrack }))
      }
    } catch (error) {
      console.error('Failed to fetch track:', error)
    } finally {
      dispatch(setLoadingState(false))
    }
  }

  const { ref, inView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView])

  const currentTime = useSelector(selectCurrentTime)
  const duration = useSelector(selectDuration)
  const playingTrackProgress = duration > 0 ? (currentTime / duration) * 100 : 0

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

      <TracksTable
        trackRows={
          pages.map((track, index) => {
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
          }) ?? []
        }
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

      {hasNextPage && (
        <div ref={ref}>
          {isFetchingNextPage ? <Spinner size={50} /> : <div style={{ height: '10px' }} />}
        </div>
      )}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </PageWithHeader>
  )
}
