import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { PlaylistCard, PlaylistCardSkeleton } from '@/entities/playlist'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { usePlaylistReactions } from '@/features/playlists/model/usePlaylistReactions'
import { TagsList, useTags } from '@/features/tags'
import { TrackCard } from '@/features/tracks'
import { useTrackReactions } from '@/features/tracks/model/useTrackReactions'
import { useTracksQuery } from '@/pages/TracksPage/model/useTracksQuery'
import {
  useCurrentTrack,
  usePlaybackState,
  usePlayerControls,
  usePlayerStore,
  useQueueControls,
} from '@/player'
import { convertApiTracksToPlayerTracks } from '@/player/utils/convert-api-track-to-player-track'
import type { SchemaIncludedArtistOutput, SchemaTrackListItemResource } from '@/shared/api/schema'
import {
  type components,
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
} from '@/shared/api/schema'
import { ReactionButtons } from '@/shared/components'
import { getArtistsByTrack } from '@/shared/utils'

import { ContentList, PageWrapper } from '../common'
import s from './MainPage.module.css'

type PlaylistListItem = components['schemas']['PlaylistListItemResource']

const NEW_TRACKS_PLAYLIST_ID = 'new-tracks'

const PlaylistMainPageCard = ({ playlist }: { playlist: PlaylistListItem }) => {
  const { handleLike, handleDislike, handleRemoveReaction } = usePlaylistReactions(playlist.id)

  return (
    <PlaylistCard
      id={playlist.id}
      title={playlist.attributes.title}
      images={playlist.attributes.images}
      userName={playlist.attributes.user.name}
      userId={playlist.attributes.user.id}
      addedAt={playlist.attributes.addedAt}
      tracksCount={playlist.attributes.tracksCount}
      shouldShowOwnerName
      shouldShowCreatedDate
      footer={
        <ReactionButtons
          entityId={playlist.id}
          currentReaction={playlist.attributes.currentUserReaction}
          likesCount={playlist.attributes.likesCount}
          onLike={handleLike}
          onDislike={handleDislike}
          onRemoveReaction={handleRemoveReaction}
        />
      }
    />
  )
}

type TrackMainPageCardProps = {
  track: SchemaTrackListItemResource
  includedArtists: SchemaIncludedArtistOutput[]
  isPlaying: boolean
  onPlaybackClick: (trackId: string) => void
}

const TrackMainPageCard = ({
  track,
  includedArtists,
  isPlaying,
  onPlaybackClick,
}: TrackMainPageCardProps) => {
  const { handleLike, handleDislike, handleRemoveReaction } = useTrackReactions(track.id)

  return (
    <TrackCard
      id={track.id}
      image={track.attributes.images.main?.[0]?.url || ''}
      title={track.attributes.title}
      artists={getArtistsByTrack(track, includedArtists)}
      isPlaying={isPlaying}
      onPlaybackClick={() => onPlaybackClick(track.id)}
      currentReaction={track.attributes.currentUserReaction}
      likesCount={track.attributes.likesCount}
      onLike={handleLike}
      onDislike={handleDislike}
      onRemoveReaction={handleRemoveReaction}
    />
  )
}

export const MainPage = () => {
  const { t } = useTranslation()
  const { loadPlaylist } = useQueueControls()
  const { play, pause, resume } = usePlayerControls()
  const { trackId: currentTrackId } = useCurrentTrack()
  const { isPlaying } = usePlaybackState()
  const currentPlaylistId = usePlayerStore((state) => state.currentPlaylistId)

  const { data: tags = [] } = useTags('')

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = usePlaylists({
    pageSize: 10,
    sortBy: PathsPlaylistsGetParametersQuerySortBy.addedAt,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
  })
  const playlists = playlistsResponse?.data?.data ?? []

  const { data: tracksResponse } = useTracksQuery({
    pageSize: 10,
  })
  const tracks = tracksResponse?.data ?? []
  const includedArtists = tracksResponse?.included ?? []

  const playerTracks = useMemo(() => convertApiTracksToPlayerTracks(tracks), [tracks])

  const handleTrackCardPlaybackClick = (trackId: string) => {
    const isCurrentTrack = currentTrackId === trackId

    if (isCurrentTrack) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
      return
    }

    if (currentPlaylistId !== NEW_TRACKS_PLAYLIST_ID) {
      const playerTrackIndex = playerTracks.findIndex((track) => track.id === trackId)
      loadPlaylist(NEW_TRACKS_PLAYLIST_ID, playerTracks, playerTrackIndex)
    }

    const playerTrack = playerTracks.find((track) => track.id === trackId)
    if (playerTrack) {
      play(playerTrack, NEW_TRACKS_PLAYLIST_ID)
    }
  }

  return (
    <PageWrapper className={s.mainPage}>
      <TagsList tags={tags || []} />
      <ContentList
        title={t('playlists.title.new_playlists')}
        data={playlists}
        isLoading={isPlaylistsLoading}
        skeleton={<PlaylistCardSkeleton showReactionButtons />}
        renderItem={(playlist) => <PlaylistMainPageCard playlist={playlist} />}
      />
      <ContentList
        title={t('tracks.title.new_tracks')}
        data={tracks}
        renderItem={(track) => (
          <TrackMainPageCard
            track={track}
            includedArtists={includedArtists}
            isPlaying={currentTrackId === track.id && isPlaying}
            onPlaybackClick={handleTrackCardPlaybackClick}
          />
        )}
      />
    </PageWrapper>
  )
}
