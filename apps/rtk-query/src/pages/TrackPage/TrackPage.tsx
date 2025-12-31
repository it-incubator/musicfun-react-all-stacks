import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { PlaylistCard, useFetchPlaylistsQuery } from '@/features/playlists'
import { TrackOverview, useFetchTrackByIdQuery } from '@/features/tracks'
import { usePageBackgroundColor } from '@/pages/common/hooks'
import type { Track } from '@/player'
import { Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWithoutHeader } from '../common'
import s from './TrackPage.module.css'
import { ControlPanel } from './ui/ControlPanel'

export const TrackPage = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { data: track, isSuccess } = useFetchTrackByIdQuery({ trackId: id! })
  const { data: me } = useMeQuery()
  const isTrackOwner = me?.userId === track?.data.attributes.user.id

  // TODO: backend don't return user id for track

  const { data: playlists } = useFetchPlaylistsQuery({ trackId: id! })

  const trackCover =
    track?.data.attributes.images &&
    getImageByType(track?.data.attributes.images, ImageType.ORIGINAL)

  const { dominantColor, canvasRef } = usePageBackgroundColor(trackCover?.url, isSuccess)

  if (!track) {
    return <div>{t('tracks.title.tracks_not_found')}</div>
  }

  // Transform TrackDetails to Track type expected by player
  const playerTrack: Track = {
    id: track.data.id,
    title: track.data.attributes.title,
    artist: track.data.attributes.artists.map((artist) => artist.name).join(', '),
    duration: track.data.attributes.duration,
    url: track.data.attributes.attachments[0]?.url || '',
    albumArt: trackCover?.url,
  }

  return (
    <PageWithoutHeader backgroundColor={dominantColor}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dominantColor && (
        <>
          <TrackOverview
            className={s.trackOverview}
            title={track.data.attributes.title}
            image={trackCover?.url}
            addedAt={track.data.attributes.addedAt}
            artists={track.data.attributes.artists.map((artist) => artist.name)}
            tags={track.data.attributes.tags}
          />

          <ControlPanel
            track={playerTrack}
            trackId={track.data.id}
            isOwnTrack={isTrackOwner}
            reaction={track.data.attributes.currentUserReaction}
            likesCount={track.data.attributes.likesCount}
          />

          <Typography variant="h2" className={s.title}>
            {t('placeholder.which_playlist')}
          </Typography>

          {playlists?.data && (
            <ContentList
              data={playlists.data}
              emptyMessage={t('playlists.title.not_found_playlists')}
              renderItem={(playlist) => (
                <PlaylistCard
                  id={playlist.id}
                  title={playlist.attributes.title}
                  imageSrc={getImageByType(playlist.attributes.images, ImageType.ORIGINAL)?.url}
                />
              )}
            />
          )}
        </>
      )}
    </PageWithoutHeader>
  )
}
