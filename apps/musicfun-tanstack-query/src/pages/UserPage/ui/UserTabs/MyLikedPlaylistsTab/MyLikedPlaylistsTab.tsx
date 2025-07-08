import { MOCK_PLAYLISTS, PlaylistCard } from '@/features/playlists'
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
            image={playlist.data.attributes.images.main[0].url}
            description={playlist.data.attributes.description.text}
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
