import { tracksKey } from "@/common/apiEntities"
import { dragEndUtilsHandler, showErrorToast, showSuccessToast } from "@/common/utils"
import { tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { queryClient } from "@/main.tsx"
import type { DragEndEvent } from "@dnd-kit/core"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { PlaylistItemAttributes, TrackDetails } from "../../api/tracksApi.types.ts"

export const useReorderTracks = (initialTracks: TrackDetails<PlaylistItemAttributes>[], playlistId: string) => {
  // Нужно чтобы DND отрабатывал без задержки.
  // Чтобы не использовать useEffect можно попробовать реализовать через optimistic update
  const [tracks, setTracks] = useState(initialTracks)
  useEffect(() => {
    setTracks(initialTracks)
  }, [initialTracks])

  const { mutate } = useMutation({
    mutationFn: tracksApi.reorderTracks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tracksKey] })
      showSuccessToast("Порядок треков обновлен")
    },
    onError: (err: unknown) => showErrorToast("Не удалось обновить порядок треков", err),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const putAfterItemId = dragEndUtilsHandler({ event, items: tracks, setItems: setTracks })
    if (putAfterItemId === undefined) return
    mutate({ playlistId, trackId: event.active.id as string, putAfterItemId })
  }

  return { handleDragEnd, tracks }
}
