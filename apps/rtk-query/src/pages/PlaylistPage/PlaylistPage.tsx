import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { PlaylistOverview, useFetchPlaylistByIdQuery } from '@/features/playlists'
import { TrackRowContainer, TracksTable, useFetchTracksInPlaylistQuery } from '@/features/tracks'
import { usePageBackgroundColor, usePageSearchParams } from '@/pages/common/hooks'
import { usePlayerControls, useQueueControls } from '@/player'
import { convertApiTracksToPlayerTracks } from '@/player/utils/convert-api-track-to-player-track'
import { Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { PageWithoutHeader, SearchTextField } from '../common'
import s from './PlaylistPage.module.css'
import { PlaylistRow } from '@/features/playlists/ui/PlaylistRow/PlaylistRow.tsx'
import { ControlPanel } from './ui/ControlPanel'
import { PlaylistPageSkeleton } from './ui/PlaylistPageSkeleton'

export const PlaylistPage = () => {
  const { t } = useTranslation()
  const { debouncedSearch } = usePageSearchParams()

  const { id } = useParams()
  const { data: playlist, isLoading: isPlaylistLoading, isSuccess } = useFetchPlaylistByIdQuery(id!)
  const { data: me } = useMeQuery()

  const isOwnPlaylist = me?.userId === playlist?.data.attributes.user.id

  const { data: tracks, isLoading: isTracksLoading } = useFetchTracksInPlaylistQuery({
    playlistId: id!,
  })

  // TODO: Implement client-side track sorting after backend fix (issue #160)
  //! FIXME: temporary implementation until backend issue #210 is fixed
  const filteredTracks =
    tracks?.data.filter((track) =>
      track.attributes.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) ?? []

  const { play } = usePlayerControls()
  const { loadPlaylist } = useQueueControls()

  const handlePlayAll = () => {
    if (filteredTracks.length === 0) {
      return
    }
    const playerTracks = convertApiTracksToPlayerTracks(filteredTracks)
    loadPlaylist(id!, playerTracks, 0)
    play(playerTracks[0], id!)
  }

  const playlistCover =
    playlist?.data.attributes.images &&
    getImageByType(playlist?.data.attributes.images, ImageType.ORIGINAL)

  const { dominantColor, canvasRef } = usePageBackgroundColor(playlistCover?.url, isSuccess)

  if (isPlaylistLoading || isTracksLoading) {
    return <PlaylistPageSkeleton />
  }

  if (!playlist) {
    return (
      <PageWithoutHeader className={s.trackPage}>
        <Typography variant="h1" className={s.errorMessage}>
          {t('playlists.label.load_error')}
        </Typography>
      </PageWithoutHeader>
    )
  }

  return (
    <PageWithoutHeader backgroundColor={dominantColor || 'var(--color-bg-primary)'}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <PlaylistOverview
        className={s.playlistOverview}
        title={playlist.data.attributes.title}
        image={playlistCover?.url}
        description={playlist.data.attributes.description || ''}
        tags={playlist.data.attributes.tags}
        userName={playlist.data.attributes.user.name}
        tracksCount={playlist.data.attributes.tracksCount}
      />
      <div className={s.playlistToolbar}>
        <SearchTextField placeholder={t('tracks.placeholder.search_tracks')} onChange={() => {}} />
        <ControlPanel
          className={s.playlistActions}
          playlistId={playlist.data.id}
          isOwnPlaylist={isOwnPlaylist}
          reaction={playlist.data.attributes.currentUserReaction}
          likesCount={playlist.data.attributes.likesCount}
          onPlayAll={handlePlayAll}
        />
      </div>
      {filteredTracks?.length > 0 ? (
        <TracksTable
          trackRows={filteredTracks.map((track, index) => ({
            index,
            id: track.id,
            title: track.attributes.title,
            imageSrc: getImageByType(track.attributes.images, ImageType.THUMBNAIL)?.url,
            addedAt: track.attributes.addedAt,
            artists: ['Artist 1', 'Artist 2'],
            duration: 100,
            likesCount: track.attributes.likesCount,
            dislikesCount: track.attributes.dislikesCount,
            currentUserReaction: track.attributes.currentUserReaction,
            url: track.attributes.attachments[0].url,
            isPublished: track.attributes.isPublished,
          }))}
          renderTrackRow={(trackRow) => (
            <TrackRowContainer
              key={trackRow.id}
              trackRow={trackRow}
              userId={me?.userId}
              playlistId={playlist.data.id}
            />
          )}
        />
      ) : (
        <div>{t('tracks.label.no_tracks')}</div>
      )}
    </PageWithoutHeader>
  )
}
