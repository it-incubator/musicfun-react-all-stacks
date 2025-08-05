import {
  type Control,
  Controller,
  type FieldErrors,
  type SubmitHandler,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from 'react-hook-form'
import type { Nullable } from '@/common/types/common.types'
import type { Playlist, UpdatePlaylistArgs } from '../../../../api/playlistsApi.types'
import { TagsSearch } from '@/common/components'

type Props = {
  editPlaylist: (playlist: Nullable<Playlist>) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  onSubmit: SubmitHandler<UpdatePlaylistArgs>
  errors?: FieldErrors<UpdatePlaylistArgs>
  control: Control<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({ onSubmit, editPlaylist, handleSubmit, register, errors, control }: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit Playlist</h2>
      <div>
        <input {...register('title')} placeholder="Title" />
        <span className="error">{errors?.title?.message}</span>
      </div>
      <div>
        <input {...register('description')} placeholder={'Description'} />
        <span className="error">{errors?.description?.message}</span>
      </div>
      <Controller
        name={'tagIds'}
        control={control}
        render={({ field }) => (
          <>
            <TagsSearch setValues={field.onChange} selectedIds={field.value || []} />
            <span className="error">{errors?.tagIds?.message}</span>
          </>
        )}
      />
      <button>Save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        Cancel
      </button>
    </form>
  )
}
