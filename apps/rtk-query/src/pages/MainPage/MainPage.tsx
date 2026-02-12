import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useMeQuery } from '@/features/auth'
import {
  PlaylistActions,
  PlaylistCard,
  PlaylistCardSkeleton,
  useFetchPlaylistsQuery,
} from '@/features/playlists'
import { TagsList, useFindTagsQuery } from '@/features/tags'
import { type IncludedArtist, TrackCard, useFetchTracksQuery } from '@/features/tracks'
import { selectCurrentPlaylistId, usePlayerControls, useQueueControls } from '@/player'
import { convertApiTracksToPlayerTracks } from '@/player/utils/convert-api-track-to-player-track.ts'
import { useAppSelector } from '@/shared/hooks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWithHeader } from '../common'
import s from './MainPage.module.css'

const NEW_TRACKS_PLAYLIST_ID = 'new-tracks'

const getArtistsByTrack = (
  track: { relationships: { artists: { data: { id: string }[] } } },
  included: IncludedArtist[]
): string => {
  const artistIds = track.relationships.artists.data.map((a) => a.id)
  return included
    .filter((artist) => artistIds.includes(artist.id))
    .map((artist) => artist.attributes.name)
    .join(', ')
}

export const MainPage = () => {
  const { t } = useTranslation()
  const { data: me } = useMeQuery()
  const isOwnPlaylist = (userId: string): boolean => me?.userId === userId
  const { loadPlaylist } = useQueueControls()
  const { play } = usePlayerControls()
  const playerPlaylistId = useAppSelector(selectCurrentPlaylistId)

  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    pageSize: 10,
  })

  const { data: tracks } = useFetchTracksQuery({
    pageSize: 10,
    pageNumber: 1,
  })

  const { data: tags } = useFindTagsQuery({ value: '' })

  const playerTracks = useMemo(
    () => tracks && convertApiTracksToPlayerTracks(tracks.data),
    [tracks]
  )

  const handleTrackCardPlaybackClick = (trackId: string) => {
    if (!playerTracks) {
      return
    }
    if (playerPlaylistId !== NEW_TRACKS_PLAYLIST_ID) {
      const playerTrackIndex = playerTracks.findIndex((track) => track.id === trackId)
      loadPlaylist(NEW_TRACKS_PLAYLIST_ID, playerTracks, playerTrackIndex)
    }
    const playerTrack = playerTracks.find((track) => track.id === trackId)
    if (playerTrack) {
      play(playerTrack, NEW_TRACKS_PLAYLIST_ID)
    }
  }

  return (
    <PageWithHeader className={s.mainPage}>
      <TagsList tags={tags || []} />
      <ContentList
        isLoading={isPlaylistsLoading}
        skeleton={<PlaylistCardSkeleton showReactionButtons />}
        title={t('playlists.title.new_playlists')}
        data={playlists?.data}
        renderItem={(playlist) => {
          const image = getImageByType(playlist.attributes.images, ImageType.MEDIUM)
          return (
            <PlaylistCard
              id={playlist.id}
              title={playlist.attributes.title}
              imageSrc={image?.url}
              isShowReactionButtons={true}
              reaction={playlist.attributes.currentUserReaction}
              likesCount={playlist.attributes.likesCount}
              userName={playlist.attributes.user.name}
              userId={playlist.attributes.user.id}
              addedAt={playlist.attributes.addedAt}
              tracksCount={playlist.attributes.tracksCount}
              shouldShowOwnerName
              shouldShowCreatedDate
              actions={
                isOwnPlaylist(playlist.attributes.user.id) && (
                  <PlaylistActions playlistId={playlist.id} />
                )
              }
            />
          )
        }}
      />

      <ContentList
        title={t('tracks.title.new_tracks')}
        data={tracks?.data}
        renderItem={(track) => (
          <TrackCard
            track={track}
            artists={getArtistsByTrack(track, tracks?.included || [])}
            handleTrackCardPlaybackClick={handleTrackCardPlaybackClick}
          />
        )}
      />
    </PageWithHeader>
  )
}
