import { DndContext } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import type { Playlist } from "@/features/playlists/api/playlistsApi.types"
import { EditPlaylistForm } from "./EditPlaylistForm/EditPlaylistForm"
import { PlaylistItem } from "./PlaylistItem/PlaylistItem"
import s from "./PlaylistsList.module.css"
import { SortableItem } from "./SortableItem/SortableItem"
import { useRemovePlaylist } from "@/features/playlists/lib/hooks/useRemovePlaylist"
import { useUpdatePlaylist } from "@/features/playlists/lib/hooks/useUpdatePlaylist"
import { useReorderPlaylist } from "@/features/playlists/lib/hooks/useReorderPlaylist"

type Props = {
  playlists: Playlist[]
}

export const PlaylistsList = ({ playlists: initialPlaylists }: Props) => {
  const { removePlaylist } = useRemovePlaylist()
  const { playlistId, editPlaylist, register, onSubmit, handleSubmit } = useUpdatePlaylist()
  const { handleDragEnd, playlists } = useReorderPlaylist(initialPlaylists)

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={playlists}>
        <div className={s.container}>
          {playlists.length ? (
            playlists.map((playlist: Playlist) => {
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
