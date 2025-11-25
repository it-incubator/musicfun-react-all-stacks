import * as React from 'react'

import type { PlaylistItemProps } from '@/entities/playlist/ui/PlaylistItem/PlaylistItem.types.ts'
import { usePlaylistReactions } from '@/features/playlists/api/use-playlists.query.ts'
import { ReactionButtons } from '@/shared/components'

import { PlaylistCard } from '../PlaylistCard'

export const PlaylistItem: React.FC<PlaylistItemProps> = (props) => {
  const { playlist } = props

  const { currentUserReaction, title, images, description, likesCount } = playlist.attributes
  const { handleLike, handleDislike, handleRemoveReaction } = usePlaylistReactions(playlist.id)

  return (
    <PlaylistCard
      id={playlist.id}
      title={title}
      images={images}
      description={description}
      footer={
        <ReactionButtons
          currentReaction={currentUserReaction}
          entityId={playlist.id}
          likesCount={likesCount}
          onDislike={handleDislike}
          onLike={handleLike}
          onRemoveReaction={handleRemoveReaction}
        />
      }
    />
  )
}
