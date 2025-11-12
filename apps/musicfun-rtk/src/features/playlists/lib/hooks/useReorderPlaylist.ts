import { useState, useEffect } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { useReorderPlaylistMutation } from '@/features/playlists/api/playlistsApi'
import { dragEndUtilsHandler, successToast } from '@/common/utils'
import type { Playlist } from '@/features/playlists/api/playlistsApi.types'

export const useReorderPlaylist = (initialPlaylists: Playlist[]) => {
  const [playlists, setPlaylists] = useState(initialPlaylists)
  const [reorderPlaylistMutation] = useReorderPlaylistMutation()
  // Need DND to work without delay.
  // To avoid using useEffect can try implementing through optimistic update
  useEffect(() => {
    setPlaylists(initialPlaylists)
  }, [initialPlaylists])

  const handleDragEnd = (event: DragEndEvent) => {
    const putAfterItemId = dragEndUtilsHandler({ event, items: playlists, setItems: setPlaylists })
    if (putAfterItemId === undefined) return

    reorderPlaylistMutation({ playlistId: event.active.id as string, putAfterItemId })
      .unwrap()
      .then(() => {
        successToast('Playlist order updated')
      })
  }

  return { handleDragEnd, playlists }
}
