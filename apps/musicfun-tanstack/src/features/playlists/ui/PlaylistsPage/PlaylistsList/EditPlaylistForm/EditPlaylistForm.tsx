import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form'
import type { Nullable } from '@/common/types'
import type { Playlist, UpdatePlaylistArgs } from '../../../../api/playlistsApi.types.ts'

type Props = {
  editPlaylist: (playlist: Nullable<Playlist>) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  onSubmit: SubmitHandler<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({ onSubmit, editPlaylist, handleSubmit, register }: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Редактировать плейлист</h2>
      <div>
        <input {...register('title')} placeholder="Title" />
      </div>
      <div>
        <input {...register('description')} placeholder={'Description'} />
      </div>
      <button>Сохранить</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        Отмена
      </button>
    </form>
  )
}
