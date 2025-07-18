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

type TrackActionsPropsBase = {
  trackId: string
  isOwner?: boolean
}

type TrackActionsPropsWithReactions = TrackActionsPropsBase & {
  reaction: CurrentUserReaction
  likesCount: number
  sizeReactionButtons?: ReactionButtonsSize
}

type TrackActionsPropsWithoutReactions = TrackActionsPropsBase & {
  reaction?: undefined
  likesCount?: undefined
  sizeReactionButtons?: undefined
}

type TrackActionsProps = TrackActionsPropsWithReactions | TrackActionsPropsWithoutReactions

export const TrackActions = ({
  reaction,
  likesCount,
  trackId,
  sizeReactionButtons = 'small',
  isOwner,
}: TrackActionsProps) => {
  const { handleOpenEditTrackModal } = useEditTrackModal()

  const [like] = useLikeTrackMutation()
  const [dislike] = useDislikeTrackMutation()
  const [unReaction] = useUnReactionTrackMutation()

  return (
    <>
      {reaction !== undefined && (
        <ReactionButtons
          reaction={reaction}
          onLike={() => like({ trackId })}
          onDislike={() => dislike({ trackId })}
          likesCount={likesCount}
          onUnReaction={() => unReaction({ trackId })}
          size={sizeReactionButtons}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {isOwner && (
            <DropdownMenuItem onClick={() => handleOpenEditTrackModal(trackId)}>
              Edit
            </DropdownMenuItem>
          )}
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
