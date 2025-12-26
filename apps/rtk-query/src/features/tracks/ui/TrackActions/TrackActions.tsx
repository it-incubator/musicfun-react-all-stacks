import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal'
import {
  useAddTrackToPlaylistMutation,
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useUnReactionTrackMutation,
} from '@/features/tracks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ReactionButtons,
  type ReactionButtonsSize,
} from '@/shared/components'
import { Paths } from '@/shared/configs'
import { AddToPlaylistIcon, EditIcon, MoreIcon, TextIcon } from '@/shared/icons'
import type { CurrentUserReaction } from '@/shared/types/commonApi.types'

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
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [isOpenChoosePlaylistModal, setIsOpenChoosePlaylistModal] = useState(false)
  const { handleOpenEditTrackModal } = useEditTrackModal()

  const { data: playlists } = useFetchPlaylistsQuery({ trackId })

  // This “server status” is the original list of playlists in which the track is located.
  const originalPlaylistIds = useMemo(
    () => playlists?.data.map((playlist) => playlist.id) ?? [],
    [playlists?.data]
  )

  // This "UI state" is what the user selects in the modal window.
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])

  const [like] = useLikeTrackMutation({
    fixedCacheKey: `track-reaction-${trackId}`,
  })
  const [dislike] = useDislikeTrackMutation({
    fixedCacheKey: `track-reaction-${trackId}`,
  })
  const [unReaction] = useUnReactionTrackMutation({
    fixedCacheKey: `track-reaction-${trackId}`,
  })

  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
  const [removeTrackFromPlaylist] = useRemoveTrackFromPlaylistMutation()

  const handleOpenChoosePlaylistModal = () => {
    // When opening the modal window, initialize the selection state with the current state from the server.
    setSelectedPlaylistIds(originalPlaylistIds)
    setIsOpenChoosePlaylistModal(true)
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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {isOwner && (
            <DropdownMenuItem onClick={() => handleOpenEditTrackModal(trackId)}>
              <EditIcon />
              {t('tracks.button.edit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleOpenChoosePlaylistModal}>
            <AddToPlaylistIcon />
            {t('tracks.button.add_to_playlist')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`${Paths.TracksLyrics}/${trackId}`)}>
            <TextIcon />
            {t('tracks.button.show_text_song')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
