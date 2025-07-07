import type { UpdateTrackArgs } from '../../../../api/tracksApi.types.ts'
import { type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form'
import { EditTrackFormArtists } from './EditTrackFormArtists/EditTrackFormArtists.tsx'
import { EditTrackFormTags } from './EditTrackFormTags/EditTrackFormTags.tsx'
import s from './EditTrackForm.module.css'

type Props = {
  editTrack: (e: MouseEvent) => void
  register: UseFormRegister<UpdateTrackArgs>
  handleSubmit: UseFormHandleSubmit<UpdateTrackArgs>
  onSubmit: SubmitHandler<UpdateTrackArgs>
  tagIds: string[]
  setTagIds: Dispatch<SetStateAction<string[]>>
  artistsIds: string[]
  setArtistsIds: Dispatch<SetStateAction<string[]>>
}

export const EditTrackForm = ({
  editTrack,
  register,
  handleSubmit,
  onSubmit,
  tagIds,
  setTagIds,
  artistsIds,
  setArtistsIds,
}: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`item item--fullwidth`}>
      <h2>Редактировать трек</h2>

      <div className={s.container}>
        <div>
          <h4 className={s.subTitle}>Описание трека</h4>
          <input {...register('title')} placeholder="Title" />
        </div>
        <div>
          <h4 className={s.subTitle}>Лирика</h4>
          <input {...register('lyrics')} placeholder="Lyrics" />
        </div>
        <EditTrackFormTags tagIds={tagIds} setTagIds={setTagIds} />
        <EditTrackFormArtists artistsIds={artistsIds} setArtistsIds={setArtistsIds} />
      </div>

      <button type={'submit'}>Сохранить</button>
      <button type={'button'} onClick={editTrack}>
        Отмена
      </button>
    </form>
  )
}
