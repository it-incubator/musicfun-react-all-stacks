import { useState } from 'react'

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

import { PageWrapper, SearchTextField, SortSelect } from '../common'
import s from './TracksPage.module.css'

export const TracksPage = () => {
  const [hashtags, setHashtags] = useState<string[]>([])
  const [artists, setArtists] = useState<string[]>([])

  // todo:task search tracks filter w/o trhotling/debounce
  // add sorting;

  const { data, isPending, isError } = useTracksQuery({})

  const { play } = usePlayerStore()

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error...</div>

  const handleClickPlay = (trackId: string) => {
    const track = data.data.find((track) => track.id === trackId)!

    play({
      src: track.attributes.attachments[0].url,
      id: track.id,
      title: track.attributes.title,
      artist: 'artist',
      coverSrc: track.attributes.images.main?.[0]?.url,
    })
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
        trackRows={data?.data.map((track, index) => ({
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
        }))}
        renderTrackRow={(trackRow) => (
          <TrackRow
            key={trackRow.id}
            trackRow={trackRow}
            playingTrackId={undefined}
            playingTrackProgress={20}
            onPlayClick={handleClickPlay}
            renderActionsCell={() => (
              <>
                <ReactionButtons
                  reaction={trackRow.currentUserReaction}
                  onLike={() => {}}
                  onDislike={() => {}}
                  likesCount={trackRow.likesCount}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger>
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
