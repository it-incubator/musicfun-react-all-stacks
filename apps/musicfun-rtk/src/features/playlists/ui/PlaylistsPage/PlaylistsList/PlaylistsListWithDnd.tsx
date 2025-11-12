import { useRemovePlaylist } from '@/features/playlists/lib/hooks/useRemovePlaylist.ts'
import { useUpdatePlaylist } from '@/features/playlists/lib/hooks/useUpdatePlaylist.ts'
import { useReorderPlaylist } from '@/features/playlists/lib/hooks/useReorderPlaylist.ts'
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
  const { playlistId, editPlaylist, register, onSubmit, handleSubmit, errors, control } = useUpdatePlaylist()
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
                      errors={errors}
                      onSubmit={onSubmit}
                      editPlaylist={editPlaylist}
                      handleSubmit={handleSubmit}
                      register={register}
                      control={control}
                    />
                  ) : (
                    <SortableItem id={playlist.id}>
                      <PlaylistItem
                        playlist={playlist}
                        editPlaylist={editPlaylist}
                        removePlaylist={removePlaylist}
                        withActions={true}
                        editable={true}
                      />
                    </SortableItem>
                  )}
                </div>
              )
            })
          ) : (
            <h1>No playlists created</h1>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
