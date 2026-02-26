import { useParams } from 'react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ChangeEvent } from 'react'

import { PlaylistOverview } from '@/features/playlists'
import { usePlaylist } from '@/features/playlists/api/use-playlist.query'
import { usePlaylistReactions } from '@/features/playlists/model/usePlaylistReactions'
import { TracksTable } from '@/features/tracks'
import { usePlaylistTracks } from '@/features/tracks/api/use-playlist-tracks.query'
import { TrackRowContainer } from '@/features/tracks/ui/TrackRowContainer/TrackRowContainer'
import {
  convertApiTracksToPlayerTracks,
  useCurrentTrack,
  usePlaybackProgress,
  usePlayerControls,
  useQueueControls,
} from '@/player'
import { useMeQuery } from '@/features/auth/api/use-me.query'
import { getArtistsByTrack, VU } from '@/shared/utils'
import { Typography } from '@/shared/components'
import { usePageSearchParams } from '@/shared/hooks'
import { usePageBackgroundColor } from '@/shared/hooks'

import { PageWithoutHeader, SearchTextField } from '../common'
import s from './PlaylistPage.module.css'
import { ControlPanel } from './ui/ControlPanel'
import { PlaylistPageSkeleton } from './ui/PlaylistPageSkeleton'

export const PlaylistPage = () => {
  const { t } = useTranslation()
  const { id: playlistId } = useParams<{ id: string }>()

  const { data: me } = useMeQuery()

  const {
    data: playlistResponse,
    isLoading: isPlaylistLoading,
    isSuccess: isPlaylistSuccess,
  } = usePlaylist(playlistId!)
  const playlist = playlistResponse?.data

  const { data: tracksResponse, isLoading: isTracksLoading } = usePlaylistTracks(playlistId!)
  const tracks = tracksResponse?.data || []
  const included = tracksResponse?.included || []
  const { search, debouncedSearch, handleSearchChange } = usePageSearchParams()

  const { handleLike, handleDislike, handleRemoveReaction } = usePlaylistReactions(playlistId!)

  const { play } = usePlayerControls()
  const { loadPlaylist } = useQueueControls()
  const { track: currentTrack } = useCurrentTrack()
  const { currentTime } = usePlaybackProgress()

  const filteredTracks = useMemo(
    () =>
      tracks.filter((track) =>
        track.attributes.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [tracks, debouncedSearch]
  )
  const playerTracks = useMemo(
    () => convertApiTracksToPlayerTracks(filteredTracks),
    [filteredTracks]
  )

  const handlePlayAll = () => {
    if (!VU.isNotEmptyArray(playerTracks)) return
    loadPlaylist(playlistId!, playerTracks, 0)
    play(playerTracks[0], playlistId!)
  }

  const handlePlayClick = (trackId: string) => {
    const trackIndex = playerTracks.findIndex((t) => t.id === trackId)
    if (trackIndex !== -1) {
      loadPlaylist(playlistId!, playerTracks, trackIndex)
      play(playerTracks[trackIndex], playlistId!)
    }
  }

  const playlistCover = playlist?.attributes.images.main?.[0]?.url || ''
  const { dominantColor, canvasRef } = usePageBackgroundColor(playlistCover, isPlaylistSuccess)

  if (isPlaylistLoading || isTracksLoading) {
    return <PlaylistPageSkeleton />
  }

  if (!playlist) {
    return (
      <PageWithoutHeader>
        <Typography variant="h1" className={s.errorMessage}>
          {t('playlists.label.load_error')}
        </Typography>
      </PageWithoutHeader>
    )
  }

  const isOwnPlaylist = me?.userId === playlist.attributes.user.id

  return (
    <PageWithoutHeader
      className={s.playlistPage}
      backgroundColor={dominantColor || 'var(--color-bg-primary)'}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <PlaylistOverview
        className={s.playlistOverview}
        title={playlist.attributes.title}
        image={playlistCover}
        description={playlist.attributes.description || ''}
        tags={playlist.attributes.tags}
        userName={playlist.attributes.user.name}
        tracksCount={playlist.attributes.tracksCount}
      />
      <ControlPanel
        playlistId={playlistId!}
        isOwnPlaylist={isOwnPlaylist}
        currentReaction={playlist.attributes.currentUserReaction}
        likesCount={playlist.attributes.likesCount}
        onLike={handleLike}
        onDislike={handleDislike}
        onRemoveReaction={handleRemoveReaction}
        onPlayAll={handlePlayAll}
      />
      <div className={s.playlistToolbar}>
        <SearchTextField
          placeholder={t('tracks.placeholder.search_tracks')}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
        />
      </div>
      <TracksTable
        trackRows={filteredTracks.map((track, index) => {
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
            // Playlist tracks payload currently does not provide duration.
            // Keep temporary fallback aligned with RTK project.
            duration: 100,
            likesCount: Number(attributes.likesCount ?? 0),
            dislikesCount: Number(attributes.dislikesCount ?? 0),
            currentUserReaction: track.attributes.currentUserReaction,
            ownerId: attributes.user?.id ?? playlist.attributes.user.id,
            isPublished: attributes.isPublished,
          }
        })}
        renderTrackRow={(trackRow) => (
          <TrackRowContainer
            key={trackRow.id}
            trackRow={trackRow}
            currentTrack={currentTrack}
            currentTime={currentTime}
            onPlayClick={handlePlayClick}
            playlistId={playlistId}
          />
        )}
      />
    </PageWithoutHeader>
  )
}
