import { type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import { type FieldErrors, type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form'
import { EditTrackFormArtists } from './EditTrackFormArtists/EditTrackFormArtists.tsx'
import { EditTrackFormTags } from './EditTrackFormTags/EditTrackFormTags.tsx'
import s from './EditTrackForm.module.css'
import type { UpdateTrackArgs } from '@/features/tracks/api/tracksApi.types.ts'

type Props = {
  editTrack: (e: MouseEvent) => void
  register: UseFormRegister<UpdateTrackArgs>
  handleSubmit: UseFormHandleSubmit<UpdateTrackArgs>
  onSubmit: SubmitHandler<UpdateTrackArgs>
  tagIds: string[]
  setTagIds: Dispatch<SetStateAction<string[]>>
  artistsIds: string[]
  setArtistsIds: Dispatch<SetStateAction<string[]>>
  errors?: FieldErrors<UpdateTrackArgs>
}

export const EditTrackForm = ({
  editTrack,
  register,
  handleSubmit,
  onSubmit,
  errors,
  tagIds,
  setTagIds,
  artistsIds,
  setArtistsIds,
}: Props) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`item item--fullwidth`}>
      <h2>Edit Track</h2>
      <div className={s.container}>
        <div>
          <h4 className={s.subTitle}>Track Description</h4>
          <input {...register('title')} placeholder="Title" />
          <span className={'error'}>{errors?.title?.message}</span>
        </div>
        <div>
          <h4 className={s.subTitle}>Lyrics</h4>
          <input {...register('lyrics')} placeholder="Lyrics" />
          <span className={'error'}>{errors?.lyrics?.message}</span>
        </div>
        <EditTrackFormTags tagIds={tagIds} setTagIds={setTagIds} />
        <EditTrackFormArtists artistsIds={artistsIds} setArtistsIds={setArtistsIds} />
      </div>

      <button type={'submit'}>Save</button>
      <button type={'button'} onClick={editTrack}>
        Cancel
      </button>
    </form>
  )
}
