import { useTranslation } from 'react-i18next'

import { PlaylistCard, PlaylistCardSkeleton, useFetchPlaylistsQuery } from '@/features/playlists'
import { TagsList, useFindTagsQuery } from '@/features/tags'
import { TrackCard, useFetchTracksQuery } from '@/features/tracks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWrapper } from '../common'
import s from './MainPage.module.css'

export const MainPage = () => {
  const { t } = useTranslation()

  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    pageSize: 10,
  })

  const { data: tracks } = useFetchTracksQuery({
    pageSize: 10,
    pageNumber: 1,
  })

  const { data: tags } = useFindTagsQuery({ value: '' })

  return (
    <PageWrapper className={s.mainPage}>
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
              description={playlist.attributes.description}
              isShowReactionButtons={true}
              reaction={playlist.attributes.currentUserReaction}
              likesCount={playlist.attributes.likesCount}
            />
          )
        }}
      />

      <ContentList
        title={t('tracks.title.new_tracks')}
        data={tracks?.data}
        renderItem={(track) => {
          const image = getImageByType(track.attributes.images, ImageType.MEDIUM)
          return (
            <TrackCard
              artistNames={['Freddie Mercury', 'John Lennon']}
              title={track.attributes.title}
              id={track.id}
              imageSrc={image?.url}
              reaction={track.attributes.currentUserReaction}
              likesCount={track.attributes.likesCount}
            />
          )
        }}
      />
    </PageWrapper>
  )
}
