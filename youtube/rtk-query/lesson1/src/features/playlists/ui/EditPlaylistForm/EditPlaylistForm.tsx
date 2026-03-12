import { useUpdatePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'
import type { UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import type { SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import s from './EditPlaylistForm.module.css'

type Props = {
  playlistId: string
  setPlaylistId: (playlistId: null) => void
  editPlaylist: (playlist: null) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({ playlistId, setPlaylistId, editPlaylist, handleSubmit, register }: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation()

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (body) => {
    if (!playlistId) return
    updatePlaylist({ playlistId, body })
    setPlaylistId(null)
  }

  return (
    <form className={`${s.form} surface-card`} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.header}>
        <p className={s.eyebrow}>Editing mode</p>
        <h2 className={s.title}>Update playlist</h2>
      </div>
      <div className={s.fieldWrap}>
        <input className="field" {...register('title')} placeholder={'Title'} />
      </div>
      <div className={s.fieldWrap}>
        <input className="field" {...register('description')} placeholder={'Description'} />
      </div>
      <div className={s.actions}>
        <button className="button" type={'submit'}>
          Save
        </button>
        <button className="button-ghost" type={'button'} onClick={() => editPlaylist(null)}>
          Cancel
        </button>
      </div>
    </form>
  )
}
