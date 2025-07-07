import { tracksKey } from '@/common/apiEntities'
import type { Nullable } from '@/common/types'
import { showErrorToast, showSuccessToast } from '@/common/utils'
import { tracksApi } from '../../../api/tracksApi.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
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

  const { mutate, isPending } = useMutation({
    mutationFn: tracksApi.createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tracksKey] })
      showSuccessToast('Трек успешно загружен')
      reset()
      setFile(null)
    },
    onError: (error) => showErrorToast('Ошибка загрузки трека', error),
  })

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      showErrorToast('Неверный формат')
      return
    }

    if (file.size > 1024 * 1024) {
      showErrorToast('Файл слишком большой (макс. 1 МБ).')
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
  }

  const isSubmitDisabled = !file || !isValid || isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Добавить новый трек</h2>
      <div>
        <label>
          Введите название трека:
          <input {...register('title')} placeholder="Введите название трека" />
        </label>
      </div>
      <div>
        <label>
          Загрузите аудио файл:
          <input type="file" accept="audio/*" onChange={uploadHandler} />
        </label>
      </div>
      <button type="submit" disabled={isSubmitDisabled}>
        {isPending ? 'Загрузка...' : 'Добавить трек'}
      </button>
    </form>
  )
}
