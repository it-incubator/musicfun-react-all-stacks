import { useMemo, useState } from 'react'

import { useMeQuery } from '@/features/auth/api/use-me.query.ts'
import { usePlaylists } from '@/features/playlists/api/use-playlists.query'
import { ChoosePlaylistModal } from '@/features/playlists/ui/ChoosePlaylistModal/ChoosePlaylistModal'
import {
  useAddTrackToPlaylistMutation,
  usePublishTrackMutation,
  useRemoveTrackFromPlaylistMutation,
  useRemoveTrackMutation,
} from '@/features/tracks/api/use-track-mutations'
import { ReactionButtons, type ReactionButtonsProps } from '@/shared/components'
import { useUIStore } from '@/shared/model/ui-store'

import { syncTrackPlaylists } from '../../utils/playlistSync'
import { TrackActionsMenu } from '../TrackActionsMenu/TrackActionsMenu'

type TrackActionsProps = {
  trackId: string
  isOwner?: boolean
  isPublished?: boolean
  playlistId?: string
} & Partial<Omit<ReactionButtonsProps, 'entityId'>>

export const TrackActions = ({
  currentReaction,
  likesCount,
  onLike,
  onDislike,
  onRemoveReaction,
  trackId,
  isOwner = false,
  isPublished,
  playlistId,
}: TrackActionsProps) => {
  const [isOpenChoosePlaylistModal, setIsOpenChoosePlaylistModal] = useState(false)

  const { data: playlistsResponse } = usePlaylists(
    { trackId },
    { enabled: isOpenChoosePlaylistModal }
  )

  const originalPlaylistIds = useMemo(
    () => playlistsResponse?.data?.data.map((playlist) => playlist.id) ?? [],
    [playlistsResponse?.data?.data]
  )

  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])

  const { data: me } = useMeQuery()
  const isAuth = !!me

  const { mutateAsync: addTrackToPlaylist } = useAddTrackToPlaylistMutation()
  const { mutateAsync: removeTrackFromPlaylist } = useRemoveTrackFromPlaylistMutation()
  const { mutate: removeTrack } = useRemoveTrackMutation()
  const { mutate: publishTrack } = usePublishTrackMutation()
  const { openCreateTrackModal } = useUIStore()

  const handleOpenChoosePlaylistModal = () => {
    setSelectedPlaylistIds(originalPlaylistIds)
    setIsOpenChoosePlaylistModal(true)
  }

  const handleDelete = () => {
    if (playlistId) {
      removeTrackFromPlaylist({ playlistId, trackId })
    } else {
      removeTrack(trackId)
    }
  }

  return (
    <>
      {currentReaction !== undefined && (
        <ReactionButtons
          entityId={trackId}
          currentReaction={currentReaction}
          onLike={onLike!}
          onDislike={onDislike!}
          likesCount={likesCount!}
          onRemoveReaction={onRemoveReaction!}
        />
      )}
      {isAuth && (
        <TrackActionsMenu
          trackId={trackId}
          isOwner={isOwner}
          isPublished={isPublished}
          onEdit={() => openCreateTrackModal(trackId)}
          onDelete={handleDelete}
          onAddToPlaylist={handleOpenChoosePlaylistModal}
          onPublish={() => publishTrack(trackId)}
        />
      )}
      {isOpenChoosePlaylistModal && (
        <ChoosePlaylistModal
          isOpen={isOpenChoosePlaylistModal}
          setIsOpen={setIsOpenChoosePlaylistModal}
          playlistIds={selectedPlaylistIds}
          setPlaylistIds={setSelectedPlaylistIds}
          onChoose={() => {
            void syncTrackPlaylists({
              originalPlaylistIds: originalPlaylistIds,
              newPlaylistIds: selectedPlaylistIds,
              trackId,
              addTrackToPlaylist: (params) => addTrackToPlaylist(params),
              removeTrackFromPlaylist: (params) => removeTrackFromPlaylist(params),
            })
          }}
        />
      )}
    </>
  )
}
