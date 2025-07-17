import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ReactionButtons,
  type ReactionButtonsSize,
} from '@/shared/components'
import { DropdownMenu } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
import type { CurrentUserReaction } from '@/shared/types/commonApi.types'

import {
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useUnReactionTrackMutation,
} from '../../api/tracksApi'
import { useEditTrackModal } from '../../model/hooks'

type TrackActionsProps = {
  trackId: string
  reaction: CurrentUserReaction
  likesCount: number
  sizeReactionButtons?: ReactionButtonsSize
}

export const TrackActions = ({
  reaction,
  likesCount,
  trackId,
  sizeReactionButtons = 'small',
}: TrackActionsProps) => {
  const { handleOpenEditTrackModal } = useEditTrackModal()

  const [like] = useLikeTrackMutation()
  const [dislike] = useDislikeTrackMutation()
  const [unReaction] = useUnReactionTrackMutation()

  return (
    <>
      <ReactionButtons
        reaction={reaction}
        onLike={() => like({ trackId })}
        onDislike={() => dislike({ trackId })}
        likesCount={likesCount}
        onUnReaction={() => unReaction({ trackId })}
        size={sizeReactionButtons}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleOpenEditTrackModal(trackId)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Add to playlist clicked!')}>
            Add to playlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
            Show text song
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
