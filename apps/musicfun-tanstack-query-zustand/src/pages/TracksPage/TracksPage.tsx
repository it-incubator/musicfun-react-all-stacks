import * as React from 'react'

import { MOCK_ARTISTS } from '@/features/artists/api/artists-api'
import { MOCK_HASHTAGS } from '@/features/tags'
import { TracksTable } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { useTracksInfinityQuery } from '@/pages/TracksPage/model/useTracksInfinityQuery.ts'
//import { useTracksQuery } from '@/pages/TracksPage/model/useTracksQuery.tsx'
import { usePlayerStore } from '@/player/model/player-store.ts'
import {
  Autocomplete,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  ReactionButtons,
  Typography,
} from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
import { VU } from '@/shared/utils'

import { PageWrapper, SearchTextField, SortSelect } from '../common'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const [hashtags, setHashtags] = React.useState<string[]>([])
  const [artists, setArtists] = React.useState<string[]>([])

  // todo: task search tracks filter w/o trhotling/debounce
  // add sorting;

  //const { data, isPending, isError } = useTracksQuery({})

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useTracksInfinityQuery({})

  const { play } = usePlayerStore()

  const tracks = React.useMemo(() => {
    return VU.isValidArray(data?.pages) ? data.pages.map((page) => page.data).flat() : []
  }, [data?.pages])

  const tracksRowsData = React.useMemo(() => {
    return VU.isValidArray(tracks)
      ? tracks.map((track, index) => ({
          index,
          id: track.id,
          title: track.attributes.title,
          image: track.attributes.images.main?.[0]?.url,
          addedAt: track.attributes.addedAt,
          artists: [], //track.attributes.artists?.map((artist) => artist.name) || [],
          duration: 0, //track.attributes.duration,
          likesCount: track.attributes.likesCount,
          dislikesCount: 0, // track.attributes.dislikesCount,
          currentUserReaction: track.attributes.currentUserReaction,
        }))
      : []
  }, [tracks])

  const handleClickPlay = React.useCallback(
    (trackId: string) => {
      const track = VU.isValidArray(tracks) ? tracks.find((track) => track.id === trackId) : void 0

      if (track) {
        play({
          artist: 'artist',
          coverSrc: track.attributes.images.main?.[0]?.url,
          id: track.id,
          src: track.attributes.attachments[0].url,
          title: track.attributes.title,
        })
      }
    },
    [tracks, play]
  )

  if (isPending) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error...</div>
  }

  return (
    <PageWrapper>
      <Typography variant="h2" as="h1" className={s.title}>
        All Tracks
      </Typography>
      <div className={s.controls}>
        <div className={s.controlsRow}>
          <SearchTextField placeholder="Search tracks" onChange={() => {}} />
          <SortSelect onChange={() => {}} />
        </div>
        <div className={s.controlsRow}>
          <Autocomplete
            options={MOCK_HASHTAGS.map((hashtag) => ({
              label: hashtag,
              value: hashtag,
            }))}
            value={hashtags}
            onChange={setHashtags}
            label="Hashtags"
            placeholder="Search by hashtags"
            className={s.autocomplete}
          />
          <Autocomplete
            options={MOCK_ARTISTS.map((artist) => ({
              label: artist.name,
              value: artist.id,
            }))}
            value={artists}
            onChange={setArtists}
            label="Artists"
            placeholder="Search by artists"
            className={s.autocomplete}
          />
        </div>
      </div>
      <TracksTable
        trackRows={tracksRowsData}
        renderTrackRow={(trackRow) => (
          <TrackRow
            key={trackRow.id}
            trackRow={trackRow}
            playingTrackId={undefined}
            playingTrackProgress={20}
            onPlayClick={handleClickPlay}
            renderActionsCell={() => (
              // todo: task Implement like/dislike
              <>
                <ReactionButtons
                  entityId={trackRow.id}
                  currentReaction={trackRow.currentUserReaction}
                  likesCount={trackRow.likesCount}
                  onDislike={() => {}}
                  onLike={() => {}}
                  onRemoveReaction={() => {}}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {/* implement add to playlist (via popup, see figma) */}
                    <MoreIcon />
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </>
            )}
          />
        )}
      />
      <Button
        className={s.showMoreButton}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}>
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Show More'
            : 'Nothing more to show'}
      </Button>
    </PageWrapper>
  )
}
