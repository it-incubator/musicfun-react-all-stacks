import { playlistsKey } from '@/common/apiEntities'
import type { Nullable } from '@/common/types'
import { showErrorToast } from '@/common/utils'
import { playlistsApi } from '../../api/playlistsApi.ts'
import type { Playlist, UpdatePlaylistArgs } from '../../api/playlistsApi.types.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

export const useUpdatePlaylist = () => {
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const [playlistId, setPlaylistId] = useState<Nullable<string>>(null)

  const { mutate } = useMutation({
    mutationFn: playlistsApi.updatePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [playlistsKey] })
      setPlaylistId(null)
    },
    onError: (err: unknown) => showErrorToast('Ошибка при обновлении плейлиста', err),
  })

  const editPlaylist = (playlist: Nullable<Playlist>) => {
    setPlaylistId(playlist?.id || null)

    if (playlist) {
      const { attributes } = playlist
      const { title, description, tags } = attributes
      reset({ title, description, tags })
    }
  }

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if (!playlistId) return
    const { tags, description, title } = data
    mutate({ playlistId, payload: { title, description, tags } })
  }

  return { register, handleSubmit, onSubmit, editPlaylist, playlistId }
}
