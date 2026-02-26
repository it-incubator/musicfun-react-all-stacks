import * as React from 'react'
import { type ChangeEvent } from 'react'
import { useOnInView } from 'react-intersection-observer'

import { useArtists } from '@/features/artists'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { useTags } from '@/features/tags'
import { TracksTable, TracksTableSkeleton } from '@/features/tracks'
import { TrackRowContainer } from '@/features/tracks/ui/TrackRowContainer/TrackRowContainer.tsx'
import { tracksSortFunction } from '@/pages/TracksPage/TracksSortFunction.ts'
import { Autocomplete, Spinner, Typography } from '@/shared/components'
import { usePageSearchParams } from '@/shared/hooks'
import { VU, getArtistsByTrack } from '@/shared/utils'
import { useTranslation } from 'react-i18next'

import { PageWithHeader, SearchTextField, SortSelect } from '../common'
import { useTracksInfinityQuery } from './model/useTracksInfinityQuery.ts'
import s from './TracksPage.module.css'
import {
  convertApiTrackToPlayerTrack,
  convertApiTracksToPlayerTracks,
  useCurrentTrack,
  usePlaybackState,
  usePlaybackProgress,
  usePlayerControls,
  useQueueControls,
} from '@/player'
import type { SchemaGetTracksRequestPayload } from '@/shared/api/schema'
import { usePlayerStore } from '@/player/model/player-store.ts'

const PAGE_SIZE = 10

export const TracksPage = () => {
  const { t } = useTranslation()

  const {
    search,
    debouncedSearch,
    sortBy: currentSortBy,
    sortDirection: currentSortDirection,
    tagsIds: hashtags,
    artistsIds: artists,
    handleSearchChange,
    handleSortChange: handleSortUpdate,
    handleTagsChange,
    handleArtistsChange,
  } = usePageSearchParams()

  const selectedSort = React.useMemo(() => {
    if (currentSortBy === 'likesCount') {
      return currentSortDirection === 'asc' ? 'leastLiked' : 'mostLiked'
    }
    return currentSortDirection === 'asc' ? 'oldest' : 'newest'
  }, [currentSortBy, currentSortDirection])

  const { sortBy, sortDirection } = tracksSortFunction(selectedSort)

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useTracksInfinityQuery({
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      sortBy: (currentSortBy as any) || sortBy,
      sortDirection: (currentSortDirection as any) || sortDirection,
      tagsIds: hashtags,
      artistsIds: artists,
    } as SchemaGetTracksRequestPayload)

  const { data: tagsData, isPending: isTagsLoading } = useTags('')
  const { data: artistsData, isPending: isArtistsLoading } = useArtists('')

  const { currentTime } = usePlaybackProgress()
  const { play, pause, resume } = usePlayerControls()
  const { addToQueue } = useQueueControls()
  const { track: currentTrack } = useCurrentTrack()
  const { isPlaying } = usePlaybackState()
  const currentPlaylistId = usePlayerStore((state) => state.currentPlaylistId)
  const previousTracksCountRef = React.useRef(0)

  const tracks = React.useMemo(() => {
    return VU.isNotEmptyArray(data?.pages) ? data.pages.map((page) => page.data).flat() : []
  }, [data?.pages])

  const included = React.useMemo(() => {
    return VU.isNotEmptyArray(data?.pages)
      ? data.pages.map((page) => page.included || []).flat()
      : []
  }, [data?.pages])

  const tracksRowsData = React.useMemo(() => {
    return tracks.map((track, index) => {
      const attributes = track.attributes as any
      return {
        index,
        id: track.id,
        title: track.attributes.title,
        image: track.attributes.images.main?.[0]?.url,
        addedAt: track.attributes.addedAt,
        artists: getArtistsByTrack(track as any, included as any)
          .split(', ')
          .filter(Boolean),
        duration: ('duration' in attributes ? attributes.duration : 0) || 0,
        likesCount: track.attributes.likesCount,
        dislikesCount: ('dislikesCount' in attributes ? attributes.dislikesCount : 0) || 0,
        currentUserReaction: track.attributes.currentUserReaction,
        ownerId: track.attributes.user.id,
        isPublished: track.attributes.isPublished,
      }
    })
  }, [tracks, included])

  const handleSearchTrack = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.currentTarget.value)
  }

  const handleSortTracks = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value
    const { sortBy, sortDirection } = tracksSortFunction(value)
    handleSortUpdate(sortBy, sortDirection)
  }

  const handleClickPlay = React.useCallback(
    (trackId: string) => {
      const track = tracks.find((track) => track.id === trackId)

      if (track) {
        if (currentTrack?.id === trackId) {
          if (isPlaying) {
            pause()
          } else {
            resume()
          }
          return
        }

        const playerTrack = convertApiTrackToPlayerTrack(track)
        const playerTracks = convertApiTracksToPlayerTracks(tracks)
        play(playerTrack, 'all-tracks', playerTracks)
      }
    },
    [currentTrack?.id, isPlaying, pause, play, resume, tracks]
  )

  React.useEffect(() => {
    if (!tracks.length) {
      previousTracksCountRef.current = 0
      return
    }

    const previousCount = previousTracksCountRef.current
    previousTracksCountRef.current = tracks.length

    if (currentPlaylistId !== 'all-tracks' || tracks.length <= previousCount) {
      return
    }

    if (previousCount === 0) {
      return
    }

    const newTracks = tracks.slice(previousCount)
    if (newTracks.length > 0) {
      addToQueue(convertApiTracksToPlayerTracks(newTracks))
    }
  }, [addToQueue, currentPlaylistId, tracks])

  const targetRef = useOnInView(
    (inView: boolean) => {
      if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
        void fetchNextPage()
      }
    },
    {
      threshold: 0.1,
      rootMargin: '300px',
      triggerOnce: false,
    }
  )

  if (isError) {
    return <div>{t('tracks.label.load_error')}</div>
  }

  const tagsOptions = React.useMemo(
    () =>
      tagsData?.map((tag) => ({
        label: tag.name,
        value: tag.id,
      })) || [],
    [tagsData]
  )

  const artistsOptions = React.useMemo(
    () =>
      artistsData?.map((artist) => ({
        label: artist.name,
        value: artist.id,
      })) || [],
    [artistsData]
  )

  return (
    <PageWithHeader>
      <Typography variant="h2" as="h1" className={s.title}>
        {t('tracks.title.all_tracks')}
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField
            placeholder={t('tracks.placeholder.search_tracks')}
            onChange={handleSearchTrack}
            value={search}
          />
          <SortSelect onChange={handleSortTracks} value={selectedSort} />
        </div>
        <div className={s.controlsRow}>
          <Autocomplete
            options={tagsOptions}
            value={hashtags}
            onChange={handleTagsChange}
            label={t('tags.label')}
            placeholder={isTagsLoading ? t('common.loading_tags') : t('tags.placeholder')}
            disabled={isTagsLoading}
            className={s.autocomplete}
          />
          <Autocomplete
            options={artistsOptions}
            value={artists}
            onChange={handleArtistsChange}
            label={t('artists.label')}
            placeholder={isArtistsLoading ? t('common.loading_artists') : t('artists.placeholder')}
            disabled={isArtistsLoading}
            className={s.autocomplete}
          />
        </div>
      </div>
      <div>
        {isPending ? (
          <TracksTableSkeleton />
        ) : (
          <TracksTable
            trackRows={tracksRowsData}
            renderTrackRow={(trackRow) => {
              return (
                <TrackRowContainer
                  key={trackRow.id}
                  trackRow={trackRow}
                  currentTrack={currentTrack}
                  currentTime={currentTime}
                  onPlayClick={handleClickPlay}
                />
              )
            }}
          />
        )}

        {!isPending && tracks.length === 0 && <div>{t('tracks.title.tracks_not_found')}</div>}
        {hasNextPage && (
          <div ref={targetRef}>
            {isFetchingNextPage ? <Spinner size={50} /> : <div style={{ height: '10px' }} />}
          </div>
        )}
      </div>
    </PageWithHeader>
  )
}
