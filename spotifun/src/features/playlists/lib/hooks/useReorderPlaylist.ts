import { playlistsKey } from "@/common/apiEntities"
import { showErrorToast } from "@/common/utils"
import { playlistsApi } from "../../api/playlistsApi.ts"
import type { Playlist } from "../../api/playlistsApi.types.ts"
import { queryClient } from "@/main.tsx"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export const useReorderPlaylist = (initialPlaylists: Playlist[]) => {
  // Нужно чтобы DND отрабатывал без задержки.
  // Чтобы не использовать useEffect можно попробовать реализовать через optimistic update
  const [playlists, setPlaylists] = useState(initialPlaylists)
  useEffect(() => {
    setPlaylists(initialPlaylists)
  }, [initialPlaylists])

  const { mutate } = useMutation({
    mutationFn: playlistsApi.reorderPlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось обновить порядок плейлистов", err),
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const activeId = active.id as string
    const overId = over && (over.id as string)

    if (!overId || activeId === overId) return

    // Локальное обновление
    // https://docs.dndkit.com/presets/sortable#overview
    const oldIndex = playlists.findIndex((p) => p.id === activeId)
    const newIndex = playlists.findIndex((p) => p.id === overId)
    if (oldIndex === -1 || newIndex === -1) return
    const newList = arrayMove(playlists, oldIndex, newIndex)
    setPlaylists(newList)

    // Отправляем на сервер новый порядок (putAfterItemId = id предыдущего в списке)
    const playlistId = activeId
    const putAfterItemId = newIndex > 0 ? newList[newIndex - 1].id : null
    if (!putAfterItemId) return
    mutate({ playlistId, putAfterItemId })
  }

  return { handleDragEnd, playlists }
}
