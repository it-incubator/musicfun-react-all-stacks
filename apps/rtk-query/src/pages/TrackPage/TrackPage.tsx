import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { TrackOverview, useFetchTrackByIdQuery } from '@/features/tracks'
import { usePageBackgroundColor, usePageSearchParams } from '@/pages/common/hooks'
import type { Track } from '@/player'
import { Pagination, Typography } from '@/shared/components'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWithoutHeader, SearchTextField } from '../common'
import s from './TrackPage.module.css'
import { PlaylistRow } from '@/features/playlists/ui/PlaylistRow/PlaylistRow.tsx'
import { ControlPanel } from './ui/ControlPanel'
import { TrackPageSkeleton } from './ui/TrackPageSkeleton'

export const TrackPage = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const {
    data: track,
    isLoading: isTrackLoading,
    isSuccess,
  } = useFetchTrackByIdQuery({ trackId: id! })
  const { data: me } = useMeQuery()
  const isTrackOwner = me?.userId === track?.data.attributes.user.id

  // TODO: backend don't return user id for track

  const { pageNumber, handlePageChange, debouncedSearch } = usePageSearchParams()

  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    trackId: id!,
    pageNumber,
    pageSize: 4,
    search: debouncedSearch,
  })

  const pagesCount = playlists?.meta.pagesCount || 1

  const trackCover =
    track?.data.attributes.images &&
    getImageByType(track?.data.attributes.images, ImageType.ORIGINAL)

  const { dominantColor, canvasRef } = usePageBackgroundColor(trackCover?.url, isSuccess)
  if (isTrackLoading || isPlaylistsLoading) {
    return <TrackPageSkeleton />
  }

  if (!track) {
    return (
      <PageWithoutHeader className={s.trackPage}>
        <Typography variant="h1" className={s.errorMessage}>
          {t('tracks.label.load_error')}
        </Typography>
      </PageWithoutHeader>
    )
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
    <PageWithoutHeader backgroundColor={dominantColor || 'var(--color-bg-primary)'}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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
        isPublished={track.data.attributes.isPublished}
        reaction={track.data.attributes.currentUserReaction}
        likesCount={track.data.attributes.likesCount}
      />

      <Typography variant="h2" className={s.title}>
        {t('placeholder.which_playlist')}
      </Typography>
      <SearchTextField placeholder={t('playlists.placeholder.search_playlist')} />
      {playlists?.data && (
        <ContentList
          layout={'row'}
          data={playlists.data}
          emptyMessage={t('playlists.title.playlists_not_found')}
          renderItem={(playlist) => (
            <PlaylistRow
              key={playlist.id}
              id={playlist.id}
              title={playlist.attributes.title}
              imageSrc={getImageByType(playlist.attributes.images, ImageType.ORIGINAL)?.url}
            />
          )}
        />
      )}
      <Pagination
        className={s.pagination}
        page={pageNumber}
        pagesCount={pagesCount}
        onPageChange={handlePageChange}
      />
    </PageWithoutHeader>
  )
}
