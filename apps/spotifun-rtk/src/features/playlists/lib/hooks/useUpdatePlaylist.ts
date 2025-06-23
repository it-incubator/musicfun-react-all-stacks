import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useUpdatePlaylistMutation } from "@/features/playlists/api/playlistsApi"
import type { Playlist, UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types"
import { showErrorToast } from "@/common/utils"
import type { Nullable } from "@/common/types"

export const useUpdatePlaylist = () => {
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)
  const [updatePlaylistMutation] = useUpdatePlaylistMutation()

  const editPlaylist = (playlist: Nullable<Playlist>) => {
    setPlaylistId(playlist?.id || null)
    if (playlist) {
      const { attributes } = playlist
      const { title, description, tags } = attributes
      reset({ title, description, tags })
    }
  }

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = async (data) => {
    if (!playlistId) return
    try {
      await updatePlaylistMutation({ playlistId, payload: data }).unwrap()
      setPlaylistId(null)
    } catch (err) {
      showErrorToast("Ошибка при обновлении плейлиста", err)
    }
  }

  return { register, handleSubmit, onSubmit, editPlaylist, playlistId }
}
