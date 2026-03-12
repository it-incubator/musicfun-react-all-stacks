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
    <form className={`${s.form} surface-card`} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.header}>
        <p className={s.eyebrow}>Create playlist</p>
        <h2 className={s.title}>Start a new collection</h2>
      </div>
      <div className={s.fieldWrap}>
        <input className="field" {...register('title')} placeholder={'Title'} />
        {errors.title && <span className={s.error}>{errors.title.message}</span>}
      </div>
      <div className={s.fieldWrap}>
        <input className="field" {...register('description')} placeholder={'Description'} />
        {errors.description && <span className={s.error}>{errors.description.message}</span>}
      </div>
      <button className="button">Create playlist</button>
    </form>
  )
}
