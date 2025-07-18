import { dragEndUtilsHandler, showSuccessToast } from '@/common/utils'
import { useReorderTracksMutation } from '../../api/tracksApi.ts'
import type { PlaylistItemAttributes, TrackDetails } from '../../api/tracksApi.types.ts'
import type { DragEndEvent } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

export const useReorderTracks = (initialTracks: TrackDetails<PlaylistItemAttributes>[], playlistId: string) => {
  // Нужно чтобы DND отрабатывал без задержки.
  // Чтобы не использовать useEffect можно попробовать реализовать через optimistic update
  const [tracks, setTracks] = useState(initialTracks)
  useEffect(() => {
    setTracks(initialTracks)
  }, [initialTracks])

  const [mutate] = useReorderTracksMutation()

  const handleDragEnd = (event: DragEndEvent) => {
    const putAfterItemId = dragEndUtilsHandler({ event, items: tracks, setItems: setTracks })
    if (!putAfterItemId) return
    mutate({ playlistId, trackId: event.active.id as string, putAfterItemId })
      .unwrap()
      .then(() => {
        showSuccessToast('Порядок треков обновлен')
      })
  }

  return { handleDragEnd, tracks }
}
