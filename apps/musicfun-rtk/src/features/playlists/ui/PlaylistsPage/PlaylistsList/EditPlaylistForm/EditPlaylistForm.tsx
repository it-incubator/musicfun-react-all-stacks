import { type FieldErrors, type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form'
import type { Nullable } from '@/common/types/common.types'
import type { Playlist, UpdatePlaylistArgs } from '../../../../api/playlistsApi.types'
import { useFindTagsQuery } from '@/features/tags/api/tagsApi.ts'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

type Props = {
  editPlaylist: (playlist: Nullable<Playlist>) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
  onSubmit: SubmitHandler<UpdatePlaylistArgs>
  errors?: FieldErrors<UpdatePlaylistArgs>
  setTagIds: Dispatch<SetStateAction<string[]>>
}

export const EditPlaylistForm = ({ onSubmit, editPlaylist, handleSubmit, register, errors, setTagIds }: Props) => {
  const { data: tags } = useFindTagsQuery({ value: '' })
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setTagIds((prev) => (prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]))
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Редактировать плейлист</h2>
      <div>
        <input {...register('title')} placeholder="Title" />
        <span className="error">{errors?.title?.message}</span>
      </div>
      <div>
        <input {...register('description')} placeholder={'Description'} />
        <span className="error">{errors?.description?.message}</span>
      </div>
      <div>
        <select multiple {...register('tagIds')} onChange={onChangeHandler}>
          {tags?.map((tag) => (
            <option value={tag.id} key={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <span className="error">{errors?.description?.message}</span>
      </div>
      <button>Сохранить</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        Отмена
      </button>
    </form>
  )
}
