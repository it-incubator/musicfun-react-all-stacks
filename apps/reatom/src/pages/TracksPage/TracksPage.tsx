import { useState } from 'react'

import { MOCK_ARTISTS } from '@/features/artists/api/artists-api'
import { MOCK_HASHTAGS } from '@/features/tags'
import { MOCK_TRACKS, TracksTable } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
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
        trackRows={MOCK_TRACKS.map((track, index) => ({
          index,
          id: track.id,
          title: track.attributes.title,
          image: track.attributes.images.main[0].url,
          addedAt: track.attributes.addedAt,
          artists: track.attributes.artists?.map((artist) => artist.name) || [],
          duration: track.attributes.duration,
          likesCount: track.attributes.likesCount,
          dislikesCount: track.attributes.dislikesCount,
          currentUserReaction: track.attributes.currentUserReaction,
        }))}
        renderTrackRow={(trackRow) => (
          <TrackRow
            key={trackRow.id}
            trackRow={trackRow}
            playingTrackId={MOCK_TRACKS[0].id}
            playingTrackProgress={20}
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
