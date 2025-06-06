import { tracksKey } from "@/common/apiEntities"
import { showErrorToast, showSuccessToast } from "@/common/utils"
import { tracksApi } from "@/features/tracks/api/tracksApi.ts"
import { useEffect, useState } from "react"
import type { PlaylistItemAttributes, TrackDetails } from "../../api/tracksApi.types.ts"
import { queryClient } from "@/main.tsx"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useMutation } from "@tanstack/react-query"

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
    const { active, over } = event
    const activeId = active.id as string
    const overId = over && (over.id as string)

    if (!overId || activeId === overId) return

    // Локальное обновление
    // https://docs.dndkit.com/presets/sortable#overview
    const oldIndex = tracks.findIndex((t) => t.id === activeId)
    const newIndex = tracks.findIndex((t) => t.id === overId)
    if (oldIndex === -1 || newIndex === -1) return
    const newList = arrayMove(tracks, oldIndex, newIndex)
    setTracks(newList)

    // Отправляем на сервер новый порядок (putAfterItemId = id предыдущего в списке)
    const putAfterItemId = newIndex > 0 ? newList[newIndex - 1].id : null
    mutate({ playlistId, trackId: activeId, putAfterItemId })
  }

  return { handleDragEnd, tracks }
}
