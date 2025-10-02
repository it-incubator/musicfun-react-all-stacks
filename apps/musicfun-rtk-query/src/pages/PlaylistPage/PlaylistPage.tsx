import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { PlaylistOverview, useFetchPlaylistByIdQuery } from '@/features/playlists'
import { TrackActions, TracksTable, useFetchTracksInPlaylistQuery } from '@/features/tracks'
import { TrackRow } from '@/features/tracks/ui/TrackRow/TrackRow'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { PageWrapper } from '../common'
import s from './PlaylistPage.module.css'
import { ControlPanel } from './ui/ControlPanel'

export const PlaylistPage = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { data: playlist } = useFetchPlaylistByIdQuery(id!)
  const { data: me } = useMeQuery()

  const isOwnPlaylist = me?.userId === playlist?.data.attributes.user.id

  const { data: tracks } = useFetchTracksInPlaylistQuery({
    playlistId: id!,
  })

  if (!playlist) {
    return <div>{t('playlists.title.playlists_not_found')}</div>
  }
  const playlistCover = getImageByType(playlist?.data.attributes.images, ImageType.ORIGINAL)

  return (
    <PageWrapper className={s.playlistPage}>
      <PlaylistOverview
        className={s.playlistOverview}
        title={playlist.data.attributes.title}
        image={playlistCover?.url}
        description={playlist.data.attributes.description}
        tags={playlist.data.attributes.tags}
      />
      <ControlPanel
        playlistId={playlist.data.id}
        isOwnPlaylist={isOwnPlaylist}
        reaction={playlist.data.attributes.currentUserReaction}
        likesCount={playlist.data.attributes.likesCount}
      />
      {tracks?.data && (
        <TracksTable
          trackRows={tracks?.data.map((track, index) => ({
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
          }))}
          renderTrackRow={(trackRow) => (
            <TrackRow
              key={trackRow.id}
              trackRow={trackRow}
              playingTrackId={'mock'}
              playingTrackProgress={20}
              renderActionsCell={(row) => (
                <TrackActions
                  likesCount={row.likesCount}
                  reaction={row.currentUserReaction}
                  trackId={row.id}
                />
              )}
            />
          )}
        />
      )}
    </PageWrapper>
  )
}
