import * as React from 'react'

import { MOCK_ARTISTS } from '@/features/artists/api/artists-api'
import { MOCK_HASHTAGS } from '@/features/tags'
import { TracksTable } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { useTracksQuery } from '@/pages/TracksPage/model/useTracksQuery.tsx'
import { usePlayerStore } from '@/player/model/player-store.ts'
import {
  Autocomplete,
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

  const { data, isPending, isError } = useTracksQuery({})
  const { play } = usePlayerStore()

  const tracksRows = React.useMemo(() => {
    return VU.isValidArray(data?.data)
      ? data.data.map((track, index) => ({
          addedAt: track.attributes.addedAt,
          artists: [], // track.attributes.artists?.map((artist) => artist.name) || [],
          currentUserReaction: track.attributes.currentUserReaction,
          dislikesCount: 0, // track.attributes.dislikesCount,
          duration: 0, // track.attributes.duration,
          id: track.id,
          image: track.attributes.images.main?.[0]?.url,
          index,
          likesCount: track.attributes.likesCount,
          title: track.attributes.title,
        }))
      : []
  }, [data?.data])

  const handleClickPlay = React.useCallback(
    (trackId: string) => {
      const track = VU.isValidArray(data?.data)
        ? data.data.find((track) => track.id === trackId)
        : void 0

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
    [data?.data, play]
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

      {/* todo:task add infinity scroll ( for first version add button Show More ) */}
      <TracksTable
        trackRows={tracksRows}
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
    </PageWrapper>
  )
}
