import { useRemovePlaylist } from "@/features/playlists/lib/hooks/useRemovePlaylist.ts"
import { useEffect, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"

import { queryClient } from "@/main.tsx"
import { playlistsKey } from "@/common/apiEntities"
import type { Nullable } from "@/common/types/common.types.ts"
import { showErrorToast } from "@/common/utils"
import { SortableItem } from "./SortableItem/SortableItem.tsx"
import { playlistsApi } from "../../../api/playlistsApi.ts"
import type { Playlist, UpdatePlaylistArgs } from "../../../api/playlistsApi.types.ts"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem.tsx"
import s from "./PlaylistsList.module.css"

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists: initialPlaylists }: Props) => {
  const [editId, setEditId] = useState<Nullable<string>>(null)

  // Нужно чтобы DND отрабатывал без задержки.
  // Чтобы не использовать useEffect можно попробовать реализовать через optimistic update
  const [playlists, setPlaylists] = useState(initialPlaylists)
  useEffect(() => {
    setPlaylists(initialPlaylists)
  }, [initialPlaylists])

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { removePlaylist } = useRemovePlaylist()

  const { mutate: updatePlaylistMutation } = useMutation({
    mutationFn: playlistsApi.updatePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [playlistsKey] })
      setEditId(null)
    },
    onError: (err: unknown) => showErrorToast("Ошибка при обновлении плейлиста", err),
  })

  const { mutate: reorderPlaylistMutation } = useMutation({
    mutationFn: playlistsApi.reorderPlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось обновить порядок плейлистов", err),
  })

  const editPlaylist = (playlist: Nullable<Playlist>) => {
    setEditId(playlist?.id || null)

    if (playlist) {
      const { attributes } = playlist
      const { title, description, tags } = attributes
      reset({ title, description, tags })
    }
  }

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

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!editId) return
    const { tags, description, title } = data
    updatePlaylistMutation({ playlistId: editId, payload: { title, description, tags } })
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={playlists}>
        <div className={s.container}>
          {playlists.length ? (
            playlists.map((playlist) => {
              const isEditing = editId === playlist.id

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
