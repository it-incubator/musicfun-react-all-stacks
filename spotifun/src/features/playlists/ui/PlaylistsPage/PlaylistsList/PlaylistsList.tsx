import { playlistsKey } from "@/common/apiEntities"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useEffect, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { showErrorToast } from "@/common/utils"
import type { Nullable } from "@/common/types/common.types.ts"
import { queryClient } from "@/main.tsx"
import { playlistsApi } from "../../../api/playlistsApi.ts"
import type { Playlist, UpdatePlaylistArgs } from "../../../api/playlistsApi.types.ts"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm.tsx"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem.tsx"
import s from "./PlaylistsList.module.css"
import { closestCenter, DndContext } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

type Props = {
  playlists: Playlist[]
}

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export const PlaylistsList = ({ playlists: initialPlaylists }: Props) => {
  const [editId, setEditId] = useState<Nullable<string>>(null)

  const [playlists, setPlaylists] = useState(initialPlaylists)

  useEffect(() => {
    setPlaylists(initialPlaylists)
  }, [initialPlaylists])

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { mutate: removePlaylistMutation } = useMutation({
    mutationFn: playlistsApi.removePlaylist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [playlistsKey] }),
    onError: (err: unknown) => showErrorToast("Не удалось удалить плейлист", err),
  })

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

  const removePlaylist = (playlistId: string) => {
    if (confirm("Вы уверены, что хотите удалить плейлист?")) {
      removePlaylistMutation(playlistId)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = playlists.findIndex((p) => p.id === active.id)
    const newIndex = playlists.findIndex((p) => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const newList = arrayMove(playlists, oldIndex, newIndex)
    setPlaylists(newList)
    // Отправляем на сервер новый порядок (putAfterItemId = id предыдущего в списке)
    const playlistId = active.id
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
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={playlists.map((p) => p.id)} strategy={verticalListSortingStrategy}>
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
                    <SortableItem key={playlist.id} id={playlist.id}>
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
