import { PlaylistCard } from '@/entities/playlist'
import { MOCK_PLAYLISTS } from '@/features/playlists'
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
            images={playlist.data.attributes.images}
            description={playlist.data.attributes.description}
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
