import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { PlaylistCard, useFetchPlaylistsQuery } from '@/features/playlists'
import { TrackOverview, useFetchTrackByIdQuery } from '@/features/tracks'
import { Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWrapper } from '../common'
import s from './TrackPage.module.css'
import { ControlPanel } from './ui/ControlPanel'

export const TrackPage = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const { data: track } = useFetchTrackByIdQuery({ trackId: id! })
  const { data: me } = useMeQuery()

  // TODO: backend don't return user id for track
  // const isOwnTrack = me?.userId === track?.data.attributes.user.id

  const { data: playlists } = useFetchPlaylistsQuery({ trackId: id! })

  if (!track) {
    return <div>{t('tracks.title.tracks_not_found')}</div>
  }

  const trackCover = getImageByType(track?.data.attributes.images, ImageType.ORIGINAL)

  return (
    <PageWrapper className={s.trackPage}>
      <TrackOverview
        className={s.trackOverview}
        title={track.data.attributes.title}
        image={trackCover?.url}
        addedAt={track.data.attributes.addedAt}
        artists={track.data.attributes.artists.map((artist) => artist.name)}
        tags={track.data.attributes.tags}
      />

      <ControlPanel
        trackId={track.data.id}
        isOwnTrack={false}
        reaction={track.data.attributes.currentUserReaction}
        likesCount={track.data.attributes.likesCount}
      />

      <Typography variant="h2" className={s.title}>
        In which playlist is the track?
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
              description={playlist.attributes.description}
            />
          )}
        />
      )}
    </PageWrapper>
  )
}
