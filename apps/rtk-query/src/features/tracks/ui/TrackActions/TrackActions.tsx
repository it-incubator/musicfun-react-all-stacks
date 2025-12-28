import { useEffect, useState } from 'react'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal'
import {
  TrackActionsMenu,
  useAddTrackToPlaylistMutation,
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useRemoveTrackMutation,
  useUnReactionTrackMutation,
} from '@/features/tracks'
import { ReactionButtons, type ReactionButtonsSize } from '@/shared/components'
import type { CurrentUserReaction } from '@/shared/types/commonApi.types'

import { useEditTrackModal } from '../../model/hooks'
import { syncTrackPlaylists } from '../../utils/playlistSync'

type TrackActionsPropsBase = {
  trackId: string
  isOwner?: boolean
  playlistId?: string
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
  isOwner = false,
  playlistId,
}: TrackActionsProps) => {
  const [isOpenChoosePlaylistModal, setIsOpenChoosePlaylistModal] = useState(false)

  const { handleOpenEditTrackModal } = useEditTrackModal()

  const { data: playlists } = useFetchPlaylistsQuery(
    { trackId },
    { skip: !isOpenChoosePlaylistModal }
  )
  const { data: isAuth } = useMeQuery()

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
  const [removeTrack] = useRemoveTrackMutation()

  const handleDelete = () => {
    if (playlistId) {
      removeTrackFromPlaylist({ playlistId, trackId })
    } else {
      removeTrack({ trackId })
    }
  }

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
      {!!isAuth && (
        <TrackActionsMenu
          trackId={trackId}
          isOwner={isOwner}
          onEdit={() => handleOpenEditTrackModal(trackId)}
          onDelete={handleDelete}
          onAddToPlaylist={() => setIsOpenChoosePlaylistModal(true)}
        />
      )}
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
