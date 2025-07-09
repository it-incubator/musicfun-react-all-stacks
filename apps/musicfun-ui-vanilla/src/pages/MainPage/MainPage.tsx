import { MOCK_PLAYLISTS, PlaylistCard } from '@/features/playlists'
import { MOCK_HASHTAGS, TagsList } from '@/features/tags'
import { MOCK_TRACKS, TrackCard } from '@/features/tracks'

import { ContentList, PageWrapper } from '../common'
import s from './MainPage.module.css'

export const MainPage = () => {
  return (
    <PageWrapper className={s.mainPage}>
      <TagsList tags={MOCK_HASHTAGS} />
      <ContentList
        title="New playlists"
        data={MOCK_PLAYLISTS}
        renderItem={(playlist) => (
          <PlaylistCard
            id={playlist.data.id}
            title={playlist.data.attributes.title}
            image={playlist.data.attributes.images.main[0].url}
            description={playlist.data.attributes.description.text}
            isShowReactionButtons={true}
            reaction={playlist.data.attributes.currentUserReaction}
            onLike={() => {}}
            onDislike={() => {}}
            likesCount={playlist.data.attributes.likesCount}
          />
        )}
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
