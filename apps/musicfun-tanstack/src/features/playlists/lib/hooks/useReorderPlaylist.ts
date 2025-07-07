import { playlistsKey } from '@/common/apiEntities'
import { dragEndUtilsHandler, showErrorToast, showSuccessToast } from '@/common/utils'
import { playlistsApi } from '../../api/playlistsApi.ts'
import type { Playlist } from '../../api/playlistsApi.types.ts'
import { queryClient } from '@/main.tsx'
import type { DragEndEvent } from '@dnd-kit/core'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useReorderPlaylist = (initialPlaylists: Playlist[]) => {
  // Нужно чтобы DND отрабатывал без задержки.
  // Чтобы не использовать useEffect можно попробовать реализовать через optimistic update
  const [playlists, setPlaylists] = useState(initialPlaylists)
  useEffect(() => {
    setPlaylists(initialPlaylists)
  }, [initialPlaylists])

  const { mutate } = useMutation({
    mutationFn: playlistsApi.reorderPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [playlistsKey] })
      showSuccessToast('Порядок плейлистов обновлен')
    },
    onError: (err: unknown) => showErrorToast('Не удалось обновить порядок плейлистов', err),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const putAfterItemId = dragEndUtilsHandler({ event, items: playlists, setItems: setPlaylists })
    if (putAfterItemId === undefined) return
    mutate({ playlistId: event.active.id as string, putAfterItemId })
  }

  return { handleDragEnd, playlists }
}
