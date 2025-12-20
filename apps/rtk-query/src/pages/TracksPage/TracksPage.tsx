import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMeQuery } from '@/features/auth'
import { MOCK_TRACKS, TracksTable, useFetchTracksInfiniteInfiniteQuery } from '@/features/tracks'
import { Spinner } from '@/shared/components/Loader/Spinner.tsx'

import { TrackActions } from '@/features/tracks/ui/TrackActions/TrackActions'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { loadPlaylist } from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { PageWrapper, SearchTags, SearchTextField, SortSelect } from '../common'
import s from './TracksPage.module.css'
import { useEffect, useRef } from 'react'
import { setAdditionalLoading } from '@/app/store/additionalLoadingSlice'

export const TracksPage = () => {
  const { t } = useTranslation()

  const {
    data: infiniteData,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchTracksInfiniteInfiniteQuery()
  const pages = infiniteData?.pages.flatMap((p) => p.data) || []
  const observerRef = useRef<HTMLDivElement>(null)
  const { data: me } = useMeQuery()

  const dispatch = useDispatch()

  const handleTrackPlayClick = (trackId: string) => {
    if (!pages) return

    // TODO: Update to pass full track array with url, title, artist, duration, albumArt
    const tracksForRedux = pages.map((t) => ({
      id: t.id,
      title: t.attributes.title,
      artist: 'artist',
      url: t.attributes.attachments[0].url,
      duration: 100,
      albumArt: undefined,
    }))
    dispatch(
      loadPlaylist({
        playlistId: 'all-tracks',
        tracks: tracksForRedux,
        startIndex: tracksForRedux?.findIndex((t) => t.id === trackId),
      })
    )
  }

  const loadMoreHandler = () => {
    // was isFetching
    if (hasNextPage && !isFetchingNextPage) {
      dispatch(setAdditionalLoading(true))
      fetchNextPage().finally(() => {
        dispatch(setAdditionalLoading(false))
      })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        threshold: 0.1,
        root: null,
        rootMargin: '100px',
      }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasNextPage, isFetching, loadMoreHandler])

  return (
    <PageWrapper>
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
            key={trackRow.id}
            trackRow={trackRow}
            playingTrackId={MOCK_TRACKS[0].id}
            playingTrackProgress={20}
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
        <div ref={observerRef}>
          {isFetchingNextPage ? <Spinner size={50} /> : <div style={{ height: '10px' }} />}
        </div>
      )}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </PageWrapper>
  )
}
