import { PlaylistCard } from '@/entities/playlist'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { MOCK_HASHTAGS, TagsList } from '@/features/tags'
import { TrackCard } from '@/features/tracks'
import { useTracksQuery } from '@/pages/TracksPage/model/useTracksQuery'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
} from '@/shared/api/schema.ts'

import { ContentList, PageWrapper } from '../common'
import s from './MainPage.module.css'

export const MainPage = () => {
  const { data: playlistsResponse } = usePlaylists({
    pageSize: 10,
    sortBy: PathsPlaylistsGetParametersQuerySortBy.addedAt,
    sortDirection: PathsPlaylistsGetParametersQuerySortDirection.desc,
  })

  const playlists = playlistsResponse?.data?.data || []

  const { data: TracksResponse } = useTracksQuery({
    pageSize: 10,
  })

  const tracks = TracksResponse?.data || []

  const trackDetails = tracks.reduce(
    (acc, query) => {
      if (query.id) {
        acc[query.id] = query
      }
      return acc
    },
    {} as Record<string, any>
  )

  return (
    <PageWrapper className={s.mainPage}>
      <TagsList tags={MOCK_HASHTAGS} />
      <ContentList
        title="New playlists"
        data={playlists}
        renderItem={(playlist) => (
          <PlaylistCard
            id={playlist.id}
            title={playlist.attributes.title}
            images={playlist.attributes.images}
            description={playlist.attributes.description}
          />
        )}
      />
      <ContentList
        title="New tracks"
        data={tracks}
        renderItem={(track) => (
          <TrackCard
            artists={trackDetails.artists?.[0]?.name || 'Artist'}
            currentReaction={track.attributes.currentUserReaction}
            id={track.id}
            image={
              trackDetails?.data?.attributes?.images?.main?.[0]?.url ||
              track.attributes.images.main?.[0]?.url
            }
            likesCount={track.attributes.likesCount}
            onDislike={() => {}}
            onLike={() => {}}
            onRemoveReaction={() => {}}
            title={track.attributes.title}
          />
        )}
      />
    </PageWrapper>
  )
}
