import { PlaylistCard } from '@/entities/playlist'
import { MOCK_PLAYLISTS } from '@/features/playlists'
import { ContentList } from '@/pages/common'
import { Pagination } from '@/shared/components'

export const MyLikedPlaylistsTab = () => {
  return (
    <>
      <ContentList
        data={[...MOCK_PLAYLISTS]}
        renderItem={(playlist) => (
          <PlaylistCard
            id={playlist.data.id}
            title={playlist.data.attributes.title}
            images={playlist.data.attributes.images}
            description={playlist.data.attributes.description}
            likesCount={playlist.data.attributes.likesCount}
            isShowReactionButtons={true}
            reaction={playlist.data.attributes.currentUserReaction}
            onLike={() => {}}
            onDislike={() => {}}
          />
        )}
      />
      <Pagination page={1} pagesCount={2} onPageChange={() => {}} />
    </>
  )
}
