import type { FC } from 'react'

import type { PlaylistItemProps } from '@/entities/playlist/ui/PlaylistItem/PlaylistItem.types.ts'
import { ReactionButtons } from '@/shared/components'

import { PlaylistCard } from '../PlaylistCard'
import { useMeQuery } from '@/features/auth/api/use-me.query'
import { usePlaylistReactions } from '@/features/playlists/model/usePlaylistReactions'

export const PlaylistItem: FC<PlaylistItemProps> = (props) => {
  const { playlist } = props
  const { data: me } = useMeQuery()

  const { currentUserReaction, title, images, description, likesCount } = playlist.attributes
  const { handleLike, handleDislike, handleRemoveReaction } =
  usePlaylistReactions(playlist.id)

  const isMyPlaylist = me?.userId === playlist.attributes.user.id

  return (
    <PlaylistCard
      id={playlist.id}
      title={title}
      images={images}
      description={description}
      canEdit={isMyPlaylist}
      footer={
        <ReactionButtons
          entityId={playlist.id}
          currentReaction={currentUserReaction}
          onLike={handleLike}
          onDislike={handleDislike}
          onRemoveReaction={handleRemoveReaction}
          likesCount={likesCount}
        />
      }
    />
  )
}
