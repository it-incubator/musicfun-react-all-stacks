import { PlaylistCard, PlaylistCardSkeleton, useFetchPlaylistsQuery } from '@/features/playlists'
import { MOCK_HASHTAGS, TagsList } from '@/features/tags'
import { MOCK_TRACKS, TrackCard } from '@/features/tracks'
import { ImageType } from '@/shared/types/commonApi.types'
import { getImageByType } from '@/shared/utils'

import { ContentList, PageWrapper } from '../common'
import s from './MainPage.module.css'

export const MainPage = () => {
  const { data: playlists, isLoading: isPlaylistsLoading } = useFetchPlaylistsQuery({
    pageSize: 10,
  })

  return (
    <PageWrapper className={s.mainPage}>
      <TagsList tags={MOCK_HASHTAGS} />

      <ContentList
        isLoading={isPlaylistsLoading}
        skeleton={<PlaylistCardSkeleton showReactionButtons />}
        title="New playlists"
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
        title="New tracks"
        data={MOCK_TRACKS}
        renderItem={(track) => (
          <TrackCard
            artists={track.attributes.artist}
            title={track.attributes.title}
            id={track.id}
            image={track.attributes.images.main[0].url}
            reaction={track.attributes.currentUserReaction}
            onDislike={() => {}}
            onLike={() => {}}
            likesCount={track.attributes.likesCount}
          />
        )}
      />
    </PageWrapper>
  )
}
