import * as React from 'react'
import { type ChangeEvent, useCallback, useState } from 'react'

import { MOCK_ARTISTS } from '@/features/artists/api/artists-api'
import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { MOCK_HASHTAGS } from '@/features/tags'
import { TracksTable } from '@/features/tracks'
import { TrackRowContainer } from '@/features/tracks/ui/TrackRowContainer/TrackRowContainer.tsx'
import { tracksSortFunction } from '@/pages/TracksPage/TracksSortFunction.ts'
import { usePlayerStore } from '@/player/model/player-store.ts'
import { Autocomplete, Typography } from '@/shared/components'
import { useDebounceValue, useInfiniteScroll } from '@/shared/hooks'
import { VU } from '@/shared/utils'
import { useTranslation } from 'react-i18next'

import { PageWrapper, SearchTextField, SortSelect } from '../common'
import { useTracksInfinityQuery } from './model/useTracksInfinityQuery.ts'
import s from './TracksPage.module.css'
import {
  convertApiTrackToPlayerTrack,
  useCurrentTrack,
  usePlaybackProgress,
  usePlayerControls,
} from '@/player'

const PAGE_SIZE = 10

export const TracksPage = () => {
  const { t } = useTranslation()

  const [hashtags, setHashtags] = React.useState<string[]>([])
  const [artists, setArtists] = React.useState<string[]>([])
  const [search, setSearch] = useState('')
  const [debouncedValue] = useDebounceValue(search)
  const [sort, setSort] = useState('newest')

  const { sortBy, sortDirection } = tracksSortFunction(sort)

  const triggerRef = React.useRef<HTMLDivElement | null>(null)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)

  // todo: task search tracks filter w/o trhotling/debounce
  // todo: add sorting;

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useTracksInfinityQuery({
      pageSize: PAGE_SIZE,
      search: debouncedValue,
      sortBy,
      sortDirection,
    })
  const { currentTime } = usePlaybackProgress()
  const { play } = usePlayerControls()
  const { track: currentTrack } = useCurrentTrack()

  const tracks = React.useMemo(() => {
    return VU.isNotEmptyArray(data?.pages) ? data.pages.map((page) => page.data).flat() : []
  }, [data?.pages])
  const tracksRowsData = React.useMemo(() => {
    return tracks.map((track, index) => ({
      index,
      id: track.id,
      title: track.attributes.title,
      image: track.attributes.images.main?.[0]?.url,
      addedAt: track.attributes.addedAt,
      artists: [], //track.attributes.artists?.map((artist) => artist.name) || [],
      // Todo: add duration for correct progress bar & duration visibility
      duration: 0, //track.attributes.duration,
      likesCount: track.attributes.likesCount,
      dislikesCount: 0, // track.attributes.dislikesCount,
      currentUserReaction: track.attributes.currentUserReaction,
      ownerId: track.attributes.user.id,
    }))
  }, [tracks])

  const handleSearchTrack = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }

  const handleSortTracks = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.currentTarget.value)
  }

  const handleClickPlay = React.useCallback(
    (trackId: string) => {
      const track = VU.isNotEmptyArray(tracks)
        ? tracks.find((track) => track.id === trackId)
        : void 0

      if (track) {
        play(convertApiTrackToPlayerTrack(track))
      }
    },
    [tracks, play]
  )

  const infinityFetchNextPage = () => {
    if (!isFetching && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  useInfiniteScroll({
    targetElement: triggerRef.current,
    rootElement: wrapperRef.current,
    callBack: infinityFetchNextPage,
    rootMargin: '300px',
    threshold: 0.1,
  })

  if (isPending) {
    return <div>{t('common.loading')}</div>
  }
  if (isError) {
    return <div>{t('tracks.label.load_error')}</div>
  }

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        {t('tracks.title.all_tracks')}
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField
            placeholder={t('tracks.placeholder.search_tracks')}
            onChange={handleSearchTrack}
          />
          <SortSelect onChange={handleSortTracks} value={sort} />
        </div>
        <div className={s.controlsRow}>
          <Autocomplete
            options={MOCK_HASHTAGS.map((hashtag) => ({
              label: hashtag,
              value: hashtag,
            }))}
            value={hashtags}
            onChange={setHashtags}
            label={t('tags.label')}
            placeholder={t('tags.placeholder')}
            className={s.autocomplete}
          />
          <Autocomplete
            options={MOCK_ARTISTS.map((artist) => ({
              label: artist.name,
              value: artist.id,
            }))}
            value={artists}
            onChange={setArtists}
            label={t('artists.label')}
            placeholder={t('artists.placeholder')}
            className={s.autocomplete}
          />
        </div>
      </div>
      <div ref={wrapperRef}>
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

        {tracks.length === 0 && <div>{t('tracks.title.tracks_not_found')}</div>}
        {hasNextPage && (
          <div ref={triggerRef}>
            {/* // Todo: change to little loader */}
            <div>{t('common.loading')}</div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
