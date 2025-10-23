import type { FC } from 'react'

import type { PlaylistItemProps } from '@/entities/playlist/ui/PlaylistItem/PlaylistItem.types.ts'
import { usePlaylistReactions } from '@/features/playlists/api/use-playlists.query.ts'
import { ReactionProvider } from '@/features/reactions/ui'
import { ReactionButtons } from '@/shared/components'

import { PlaylistCard } from '../PlaylistCard'

export const PlaylistItem: FC<PlaylistItemProps> = (props) => {
  const { playlist } = props

  const { currentUserReaction, title, images, description, likesCount } = playlist.attributes
  const { handleLike, handleDislike, handleRemoveReaction } = usePlaylistReactions(playlist.id)

  return (
    <PlaylistCard
      id={playlist.id}
      title={title}
      images={images}
      description={description}
      render={() => (
        <ReactionProvider
          entityId={playlist.id}
          currentReaction={currentUserReaction}
          onLike={() => handleLike()}
          onDislike={() => handleDislike()}
          onRemoveReaction={() => handleRemoveReaction()}
          likesCount={likesCount}>
          {({ reaction, onLike, onDislike, likesCount }) => (
            <ReactionButtons
              reaction={reaction}
              onLike={onLike}
              onDislike={onDislike}
              likesCount={likesCount}
            />
          )}
        </ReactionProvider>
      )}
    />
  )
}
