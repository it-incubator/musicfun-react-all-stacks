import { useForm } from 'react-hook-form'
import type { SchemaUpdatePlaylistRequestPayload } from '../../../../shared/api/schema.ts'
import { useEffect } from 'react'
import { usePlaylistQuery } from '../api/use-playlist-query.tsx'
import { useUpdatePlaylistMutation } from '../api/use-update-playlist-mutation.ts'
import { queryErrorHandlerForRHFFactory } from '../../../../shared/ui/util/query-error-handler-for-rhf-factory.ts'

type Props = {
  playlistId: string | null
  onCancelEditing: () => void
}

export const EditPlaylistForm = ({ playlistId, onCancelEditing }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SchemaUpdatePlaylistRequestPayload>()

  useEffect(() => {
    reset()
  }, [playlistId])

  const { data, isPending, isError } = usePlaylistQuery(playlistId)

  const { mutate } = useUpdatePlaylistMutation({
    onSuccess: () => {
      onCancelEditing()
    },
    onError: queryErrorHandlerForRHFFactory({ setError }),
  })

  const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
    mutate({ ...data, playlistId: playlistId! })
  }

  const handleCancelEditingClick = () => {
    onCancelEditing()
  }

  if (!playlistId) return <></>
  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Error...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit Playlist</h2>
      <p>
        <input {...register('title')} defaultValue={data.data.attributes.title} />
      </p>
      {errors.title && <p>{errors.title.message}</p>}
      <p>
        <textarea {...register('description')} defaultValue={data.data.attributes.description!}></textarea>
      </p>
      {errors.description && <p>{errors.description.message}</p>}
      <button type={'submit'}>Save</button>
      <button type={'reset'} onClick={handleCancelEditingClick}>
        Cancel
      </button>
      {errors.root?.server && <p>{errors.root?.server.message}</p>}
    </form>
  )
}
