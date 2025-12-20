import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetchPlaylistsQuery } from '@/features/playlists'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal'
import {
  useAddTrackToPlaylistMutation,
  useDislikeTrackMutation,
  useLikeTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useRemoveTrackMutation,
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
import { AddToPlaylistIcon, DeleteIcon, EditIcon, MoreIcon, TextIcon } from '@/shared/icons'
import type { CurrentUserReaction } from '@/shared/types/commonApi.types'

import { Paths } from '@/shared/configs'
import { useNavigate } from 'react-router'
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
  isOwner,
  playlistId,
}: TrackActionsProps) => {
  const { t } = useTranslation()

  const [isOpenChoosePlaylistModal, setIsOpenChoosePlaylistModal] = useState(false)

  const { handleOpenEditTrackModal } = useEditTrackModal()

  const { data: playlists } = useFetchPlaylistsQuery({ trackId })

  const [playlistIds, setPlaylistIds] = useState<string[]>([])

  const navigate = useNavigate()

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

  const removeTrackHandler = () => {
    removeTrack({ trackId })
      .unwrap()
      .then(() => navigate(-1))
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
            <>
              <DropdownMenuItem onClick={() => handleOpenEditTrackModal(trackId)}>
                <EditIcon />
                {t('tracks.button.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  playlistId
                    ? removeTrackFromPlaylist({ playlistId, trackId })
                    : removeTrackHandler()
                }>
                <DeleteIcon width={24} height={24} />
                {t('tracks.button.delete')}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => setIsOpenChoosePlaylistModal(true)}>
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
