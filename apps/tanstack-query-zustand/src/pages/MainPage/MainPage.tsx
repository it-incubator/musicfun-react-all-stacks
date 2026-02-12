import { PlaylistCard, PlaylistCardSkeleton } from '@/entities/playlist'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { usePlaylistReactions } from '@/features/playlists/model/usePlaylistReactions'
import { TagsList, useTags } from '@/features/tags'
import { TrackCard } from '@/features/tracks'
import { useTracksQuery } from '@/pages/TracksPage/model/useTracksQuery'
import type { components } from '@/shared/api/schema.ts'
import {
  PathsPlaylistsGetParametersQuerySortBy,
  PathsPlaylistsGetParametersQuerySortDirection,
} from '@/shared/api/schema.ts'
import { ReactionButtons } from '@/shared/components'
import { useTranslation } from 'react-i18next'

import { ContentList, PageWrapper } from '../common'
import s from './MainPage.module.css'

type PlaylistListItem = components['schemas']['PlaylistListItemResource']

const PlaylistMainPageCard = ({ playlist }: { playlist: PlaylistListItem }) => {
  const { handleLike, handleDislike, handleRemoveReaction } = usePlaylistReactions(playlist.id)

  return (
    <PlaylistCard
      id={playlist.id}
      title={playlist.attributes.title}
      images={playlist.attributes.images}
      userName={playlist.attributes.user.name}
      userId={playlist.attributes.user.id}
      addedAt={playlist.attributes.addedAt}
      tracksCount={playlist.attributes.tracksCount}
      shouldShowOwnerName
      shouldShowCreatedDate
      footer={
        <ReactionButtons
          entityId={playlist.id}
          currentReaction={playlist.attributes.currentUserReaction}
          likesCount={playlist.attributes.likesCount}
          onLike={handleLike}
          onDislike={handleDislike}
          onRemoveReaction={handleRemoveReaction}
        />
      }
    />
  )
}

export const MainPage = () => {
  const { t } = useTranslation()

  const { data: tags } = useTags('')

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = usePlaylists({
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
      <TagsList tags={tags || []} />
      <ContentList
        title={t('playlists.title.new_playlists')}
        data={playlists}
        isLoading={isPlaylistsLoading}
        skeleton={<PlaylistCardSkeleton showReactionButtons />}
        renderItem={(playlist) => <PlaylistMainPageCard playlist={playlist} />}
      />
      <ContentList
        title={t('tracks.title.new_tracks')}
        data={tracks}
        renderItem={(track) => (
          <TrackCard
            artists={trackDetails.artists?.[0]?.name || t('tracks.label.artist')}
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
