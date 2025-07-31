import type { Nullable } from '@/common/types'
import { errorToast, successToast } from '@/common/utils'
import { useCreateTrackMutation, usePublishTrackMutation } from '@/features/tracks/api/tracksApi.ts'
import { type ChangeEvent, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

export const AddTrackForm = () => {
  const [file, setFile] = useState<Nullable<File>>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<{ title: string }>({ mode: 'onChange' })

  const [mutate, { isLoading }] = useCreateTrackMutation()
  const [publishTrack] = usePublishTrackMutation()

  const [shouldPublish, setShouldPublish] = useState(false)

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      errorToast('Invalid format')
      return
    }

    if (file.size > 1024 * 1024) {
      errorToast('File too large (max 1 MB).')
      return
    }

    setFile(file)
  }

  const onSubmit: SubmitHandler<{ title: string }> = ({ title }) => {
    if (!file) {
      alert('no file')
      return
    }
    mutate({ title, file })
      .unwrap()
      .then((res) => {
        if (shouldPublish) publishTrack({ trackId: res.data.id })
        successToast('Track uploaded successfully')
        reset()
        setFile(null)
      })
  }

  const isSubmitDisabled = !file || !isValid || isLoading

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add New Track</h2>
      <div>
        <label>
          Enter track title:
          <input {...register('title')} placeholder="Enter track title" />
        </label>
      </div>
      <div>
        <label>
          Upload audio file:
          <input type="file" accept="audio/*" onChange={uploadHandler} />
        </label>
      </div>
      <button type="submit" disabled={isSubmitDisabled}>
        {isLoading ? 'Loading...' : 'Add Track'}
      </button>
      <label>
        <input type="checkbox" onChange={(e) => setShouldPublish(e.currentTarget.checked)} />
        Publish
      </label>
    </form>
  )
}
