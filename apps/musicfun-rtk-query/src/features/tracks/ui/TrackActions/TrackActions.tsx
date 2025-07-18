import { useEffect, useState } from 'react'

import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal'
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
  useAddTrackToPlaylistMutation,
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useUnReactionTrackMutation,
} from '../../api/tracksApi'
import { useEditTrackModal } from '../../model/hooks'
import { syncTrackPlaylists } from '../../utils/playlistSync'

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
  const [isOpenChoosePlaylistModal, setIsOpenChoosePlaylistModal] = useState(false)

  const { handleOpenEditTrackModal } = useEditTrackModal()

  const { data: playlists } = useFetchPlaylistsQuery({ trackId })

  const [playlistIds, setPlaylistIds] = useState<string[]>([])

  // update playlistIds when playlists change
  useEffect(() => {
    if (playlists?.data) {
      setPlaylistIds(playlists.data.map((playlist) => playlist.id))
    }
  }, [playlists?.data])

  const [like] = useLikeTrackMutation()
  const [dislike] = useDislikeTrackMutation()
  const [unReaction] = useUnReactionTrackMutation()

  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [removeTrackFromPlaylist] = useRemoveTrackFromPlaylistMutation()

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
          <DropdownMenuItem onClick={() => setIsOpenChoosePlaylistModal(true)}>
            Add to playlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
            Show text song
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isOpenChoosePlaylistModal && (
        <ChoosePlaylistModal
          isOpen={isOpenChoosePlaylistModal}
          setIsOpen={setIsOpenChoosePlaylistModal}
          playlistIds={playlistIds}
          setPlaylistIds={setPlaylistIds}
          onChoose={() => {
            syncTrackPlaylists({
              originalPlaylistIds: playlists?.data.map((playlist) => playlist.id) || [],
              newPlaylistIds: playlistIds,
              trackId,
              addTrackToPlaylist: (params) => addTrackToPlaylist(params).unwrap(),
              removeTrackFromPlaylist: (params) => removeTrackFromPlaylist(params).unwrap(),
            })
          }}
        />
      )}
    </>
  )
}
