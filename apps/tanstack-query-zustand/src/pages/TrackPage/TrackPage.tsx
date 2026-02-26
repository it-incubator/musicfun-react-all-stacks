import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { useMeQuery } from '@/features/auth/api/use-me.query'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { PlaylistRow } from '@/features/playlists/ui/PlaylistRow'
import { TrackOverview } from '@/features/tracks'
import { useTrack } from '@/features/tracks/api/use-track.query'
import { convertApiTrackToPlayerTrack, type Track } from '@/player'
import { Pagination, Typography } from '@/shared/components'
import { usePageBackgroundColor, usePageSearchParams } from '@/shared/hooks'
import { getImageByType } from '@/shared/utils/get-image-by-type'

import { ContentList, PageWithoutHeader, SearchTextField } from '../common'
import s from './TrackPage.module.css'
import { TrackPageSkeleton } from './ui/TrackPageSkeleton'
import { ControlPanel } from './ui/ControlPanel'

export const TrackPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { data: me } = useMeQuery()
  const {
    data: trackResponse,
    isLoading: isTrackLoading,
    isSuccess: isTrackSuccess,
  } = useTrack(id!)
  const track = trackResponse?.data
  const isTrackOwner = me?.userId === track?.attributes.user.id

  const { search, pageNumber, handlePageChange, handleSearchChange, debouncedSearch } =
    usePageSearchParams()

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = usePlaylists({
    trackId: id!,
    pageNumber,
    pageSize: 4,
    search: debouncedSearch,
  })
  const pagesCount = playlistsResponse?.data?.meta.pagesCount || 1

  const trackCover = track?.attributes.images && getImageByType(track.attributes.images, 'original')
  const { dominantColor, canvasRef } = usePageBackgroundColor(trackCover?.url, isTrackSuccess)

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

  const playerTrack: Track = convertApiTrackToPlayerTrack(track)

  return (
    <PageWithoutHeader backgroundColor={dominantColor || 'var(--color-bg-primary)'}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <TrackOverview
        className={s.trackOverview}
        title={track.attributes.title}
        image={trackCover?.url}
        addedAt={track.attributes.addedAt}
        artists={track.attributes.artists.map((artist) => artist.name)}
        tags={track.attributes.tags}
      />

      <ControlPanel
        track={playerTrack}
        trackId={track.id}
        isOwnTrack={!!isTrackOwner}
        isPublished={track.attributes.isPublished}
        currentReaction={track.attributes.currentUserReaction}
        likesCount={track.attributes.likesCount}
      />

      <Typography variant="h2" className={s.title}>
        {t('placeholder.which_playlist')}
      </Typography>
      <SearchTextField
        placeholder={t('playlists.placeholder.search_playlist')}
        className={s.search}
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      <ContentList
        layout={'row'}
        data={playlistsResponse?.data?.data}
        emptyMessage={t('playlists.title.playlists_not_found')}
        renderItem={(playlist) => (
          <PlaylistRow
            key={playlist.id}
            id={playlist.id}
            title={playlist.attributes.title}
            imageSrc={getImageByType(playlist.attributes.images, 'original')?.url}
          />
        )}
      />

      <Pagination
        className={s.pagination}
        page={pageNumber}
        pagesCount={pagesCount}
        onPageChange={handlePageChange}
      />
    </PageWithoutHeader>
  )
}
