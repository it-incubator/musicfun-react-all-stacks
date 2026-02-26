import { useMemo, useState } from 'react'

import { useMeQuery } from '@/features/auth'
import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal'
import {
  TrackActionsMenu,
  useAddTrackToPlaylistMutation,
  useDislikeTrackMutation,
  useLikeTrackMutation,
  usePublishTrackMutation,
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
  isPublished?: boolean
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
  isPublished,
  playlistId,
}: TrackActionsProps) => {
  const [isOpenChoosePlaylistModal, setIsOpenChoosePlaylistModal] = useState(false)
  const { handleOpenEditTrackModal } = useEditTrackModal()

  const { data: playlists } = useFetchPlaylistsQuery(
    { trackId },
    { skip: !isOpenChoosePlaylistModal }
  )

  // This "server status" is the original list of playlists in which the track is located.
  const originalPlaylistIds = useMemo(
    () => playlists?.data.map((playlist) => playlist.id) ?? [],
    [playlists?.data]
  )

  // This "UI state" is what the user selects in the modal window.
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])

  const { data: isAuth } = useMeQuery()

  const [like] = useLikeTrackMutation()
  const [dislike] = useDislikeTrackMutation()
  const [unReaction] = useUnReactionTrackMutation()

  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [removeTrackFromPlaylist] = useRemoveTrackFromPlaylistMutation()
  const [removeTrack] = useRemoveTrackMutation()
  const [publishTrack] = usePublishTrackMutation()

  const handleOpenChoosePlaylistModal = () => {
    // When opening the modal window, initialize the selection state with the current state from the server.
    setSelectedPlaylistIds(originalPlaylistIds)
    setIsOpenChoosePlaylistModal(true)
  }

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
          isPublished={isPublished}
          onEdit={() => handleOpenEditTrackModal(trackId)}
          onDelete={handleDelete}
          onAddToPlaylist={handleOpenChoosePlaylistModal}
          onPublish={() => publishTrack({ trackId })}
        />
      )}
      {isOpenChoosePlaylistModal && (
        <ChoosePlaylistModal
          isOpen={isOpenChoosePlaylistModal}
          setIsOpen={setIsOpenChoosePlaylistModal}
          playlistIds={selectedPlaylistIds}
          setPlaylistIds={setSelectedPlaylistIds}
          onChoose={() => {
            syncTrackPlaylists({
              originalPlaylistIds: originalPlaylistIds,
              newPlaylistIds: selectedPlaylistIds,
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
