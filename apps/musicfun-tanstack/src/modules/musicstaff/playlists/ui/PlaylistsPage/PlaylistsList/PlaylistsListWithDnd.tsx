import { useRemovePlaylist } from '@/modules/musicstaff/playlists/lib/hooks/useRemovePlaylist.ts'
import { useUpdatePlaylist } from '@/modules/musicstaff/playlists/lib/hooks/useUpdatePlaylist.ts'
import { useReorderPlaylist } from '@/modules/musicstaff/playlists/lib/hooks/useReorderPlaylist.ts'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import type { Playlist } from '../../../api/playlistsApi.types.ts'
import { EditPlaylistForm } from './EditPlaylistForm/EditPlaylistForm.tsx'
import { PlaylistItem } from './PlaylistItem/PlaylistItem.tsx'
import { SortableItem } from './SortableItem/SortableItem.tsx'
import s from './PlaylistsList.module.css'

type Props = {
  playlists: Playlist[]
}

export const PlaylistsWithDnd = ({ playlists: initialPlaylists }: Props) => {
  const { removePlaylist } = useRemovePlaylist()
  const { playlistId, editPlaylist, register, onSubmit, handleSubmit } = useUpdatePlaylist()
  const { handleDragEnd, playlists } = useReorderPlaylist(initialPlaylists)

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={playlists}>
        <div className={s.container}>
          {playlists.length ? (
            playlists.map((playlist) => {
              const isEditing = playlistId === playlist.id

              return (
                <div key={playlist.id} className={'item'}>
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
