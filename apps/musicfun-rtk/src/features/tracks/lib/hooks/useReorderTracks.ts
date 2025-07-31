import { dragEndUtilsHandler, successToast } from '@/common/utils'
import { useReorderTracksMutation } from '../../api/tracksApi.ts'
import type { PlaylistItemAttributes, TrackDetails } from '../../api/tracksApi.types.ts'
import type { DragEndEvent } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

export const useReorderTracks = (initialTracks: TrackDetails<PlaylistItemAttributes>[], playlistId: string) => {
  // Need DND to work without delay.
  // To avoid using useEffect can try implementing through optimistic update
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
        successToast('Track order updated')
      })
  }

  return { handleDragEnd, tracks }
}
