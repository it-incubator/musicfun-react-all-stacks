import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ReactionButtons,
  type ReactionButtonsSize,
} from '@/shared/components'
import { DropdownMenu } from '@/shared/components'
import { MoreIcon } from '@/shared/icons'
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
              {t('tracks.button.edit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsOpenChoosePlaylistModal(true)}>
            {t('tracks.button.add_to_playlist')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert('Show text song clicked!')}>
            {t('tracks.button.show_text_song')}
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
