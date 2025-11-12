import { useCreatePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'
import type { CreatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { createPlaylistSchema } from '@/features/playlists/model/playlists.schemas.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
import s from './CreatePlaylistForm.module.css'

export const CreatePlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistArgs>({ resolver: zodResolver(createPlaylistSchema) })

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlaylist(data)
      .unwrap()
      .then(() => reset())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
        {errors.title && <span className={s.error}>{errors.title.message}</span>}
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
        {errors.description && <span className={s.error}>{errors.description.message}</span>}
      </div>
      <button>create playlist</button>
    </form>
  )
}
