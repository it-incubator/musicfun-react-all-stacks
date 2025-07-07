import { playlistsKey } from '@/common/apiEntities'
import { showErrorToast } from '@/common/utils'
import { playlistsApi } from '../../../api/playlistsApi.ts'
import type { CreatePlaylistArgs } from '../../../api/playlistsApi.types.ts'
import { useMutation } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { queryClient } from '@/main.tsx'

export const AddPlaylistForm = () => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()

  const { mutate } = useMutation({
    mutationFn: playlistsApi.createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [playlistsKey] })
      reset()
    },
    onError: (err: unknown) => showErrorToast('Ошибка при создании плейлиста', err),
  })

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Добавить новый плейлист</h2>
      <div>
        <input {...register('title')} placeholder="Title" />
      </div>
      <div>
        <input {...register('description')} placeholder={'Description'} />
      </div>
      <button>Создать плейлист</button>
    </form>
  )
}
