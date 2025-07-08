import { MOCK_PLAYLIST, PlaylistOverview } from '@/features/playlists'
import { MOCK_TRACKS, TracksTable } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { ReactionButtons } from '@/shared/components'

import { PageWrapper } from '../common'
import s from './PlaylistPage.module.css'
import { ControlPanel } from './ui/ControlPanel'

export const PlaylistPage = () => {
  const playlist = MOCK_PLAYLIST

  return (
    <PageWrapper className={s.playlistPage}>
      <PlaylistOverview
        className={s.playlistOverview}
        title={playlist.data.attributes.title}
        image={playlist.data.attributes.images.main[0].url}
        description={playlist.data.attributes.description.text}
        tags={playlist.data.attributes.tags}
      />
      <ControlPanel />
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
            trackRow={trackRow}
            playingTrackId={MOCK_TRACKS[0].id}
            playingTrackProgress={20}
            renderActionsCell={(row) => (
              <ReactionButtons
                reaction={row.currentUserReaction}
                onLike={() => {}}
                onDislike={() => {}}
                likesCount={row.likesCount}
              />
            )}
          />
        )}
      />
    </PageWrapper>
  )
}
