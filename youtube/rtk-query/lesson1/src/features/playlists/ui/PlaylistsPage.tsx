import { useDeletePlaylistMutation, useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { EditPlaylistForm } from '@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm.tsx'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const { data } = useFetchPlaylistsQuery()

  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId)
    }
  }

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
          const isEditing = playlist.id === playlistId

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  playlistId={playlistId}
                  setPlaylistId={setPlaylistId}
                  editPlaylist={editPlaylistHandler}
                  register={register}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <PlaylistItem
                  playlist={playlist}
                  deletePlaylistHandler={deletePlaylistHandler}
                  editPlaylistHandler={editPlaylistHandler}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
