import { errorHandler } from '@/common/utils'
import { useCreatePlaylistMutation } from '../../../api/playlistsApi'
import type { CreatePlaylistArgs } from '../../../api/playlistsApi.types'
import { type SubmitHandler, useForm } from 'react-hook-form'

export const AddPlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreatePlaylistArgs>()

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = async (data) => {
    try {
      await createPlaylist(data).unwrap()
      reset()
    } catch (e) {
      errorHandler(e, setError)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add New Playlist</h2>
      <div>
        <input {...register('title')} placeholder="Title" />
        <span className="error">{errors?.title?.message}</span>
      </div>
      <div>
        <input {...register('description')} placeholder={'Description'} />
        <span className="error">{errors?.description?.message}</span>
      </div>
      <button>Create Playlist</button>
    </form>
  )
}
