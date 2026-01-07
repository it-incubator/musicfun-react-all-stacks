import { useTranslation } from 'react-i18next'

import { useMeQuery } from '@/features/auth'
import {
  PlaylistActions,
  PlaylistCard,
  PlaylistCardSkeleton,
  useFetchPlaylistsQuery,
} from '@/features/playlists'
import { TagsList, useFindTagsQuery } from '@/features/tags'
import { TrackCard, useFetchTracksQuery } from '@/features/tracks'
import { loadPlaylist } from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
import { useAppDispatch } from '@/shared/hooks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWithHeader } from '../common'
import s from './MainPage.module.css'

export const MainPage = () => {
  const { t } = useTranslation()
  const { data: me } = useMeQuery()
  const isOwnPlaylist = (userId: string): boolean => me?.userId === userId
  const dispatch = useAppDispatch()

  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    pageSize: 10,
  })

  const { data: tracks } = useFetchTracksQuery({
    pageSize: 10,
    pageNumber: 1,
  })

  const { data: tags } = useFindTagsQuery({ value: '' })

  const handleTrackCardPlaybackClick = (trackId: string) => {
    if (!tracks) return
    const tracksForRedux = tracks.data.map((t) => {
      const image = getImageByType(t.attributes.images, ImageType.MEDIUM)
      return {
        id: t.id,
        title: t.attributes.title,
        artist: 'artist',
        duration: 100,
        url: t.attributes.attachments[0].url,
        albumArt: image?.url || noCoverPlaceholder,
      }
    })
    dispatch(
      loadPlaylist({
        playlistId: 'new-tracks',
        tracks: tracksForRedux,
        startIndex: tracksForRedux?.findIndex((t) => t.id === trackId),
      })
    )
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
          <TrackCard track={track} loadPlaylistToPLayer={handleTrackCardPlaybackClick} />
        )}
      />
    </PageWithHeader>
  )
}
