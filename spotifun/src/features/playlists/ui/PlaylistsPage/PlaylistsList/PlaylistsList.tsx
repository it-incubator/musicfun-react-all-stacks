import { playlistsKey } from "@/common/apiEntities"
import { showErrorToast } from "@/common/utils"
import { useRemovePlaylist } from "@/features/playlists/lib/hooks/useRemovePlaylist.ts"
import { useUpdatePlaylist } from "@/features/playlists/lib/hooks/useUpdatePlaylist.ts"
import { queryClient } from "@/main.tsx"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { playlistsApi } from "../../../api/playlistsApi.ts"
import type { Playlist } from "../../../api/playlistsApi.types.ts"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem.tsx"
import s from "./PlaylistsList.module.css"
import { SortableItem } from "./SortableItem/SortableItem.tsx"

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists: initialPlaylists }: Props) => {
  // Нужно чтобы DND отрабатывал без задержки.
  // Чтобы не использовать useEffect можно попробовать реализовать через optimistic update
  const [playlists, setPlaylists] = useState(initialPlaylists)
  useEffect(() => {
    setPlaylists(initialPlaylists)
  }, [initialPlaylists])

  const { removePlaylist } = useRemovePlaylist()
  const { playlistId, editPlaylist, register, onSubmit, handleSubmit } = useUpdatePlaylist()

  const { mutate: reorderPlaylistMutation } = useMutation({
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
    reorderPlaylistMutation({ playlistId, putAfterItemId })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={playlists}>
        <div className={s.container}>
          {playlists.length ? (
            playlists.map((playlist) => {
              const isEditing = playlistId === playlist.id

              return (
                <div key={playlist.id} className={"item"}>
                  {isEditing ? (
                    <EditPlaylistForm
                      onSubmit={onSubmit}
                      editPlaylist={editPlaylist}
                      handleSubmit={handleSubmit}
                      register={register}
                    />
                  ) : (
                    <SortableItem id={playlist.id} title={playlist.attributes.title}>
                      <PlaylistItem playlist={playlist} editPlaylist={editPlaylist} removePlaylist={removePlaylist} />
                    </SortableItem>
                  )}
                </div>
              )
            })
          ) : (
            <h1>Плейлисты не созданы</h1>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
