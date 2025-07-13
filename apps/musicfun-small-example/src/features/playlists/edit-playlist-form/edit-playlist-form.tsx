import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getClient } from '../../../shared/api/client'
import type { components } from '../../../shared/api/schema'
import { requestWrapper } from '../../../shared/api/request-wrapper.ts'
import { queryErrorHandlerForRHFFactory } from '../../../shared/api/query-error-handler-for-rhf-factory.ts'

type Props = {
  classNames: string
  playlistId: string | null
  onCancelEditing: () => void
}

type UpdatePlaylistRequestPayload = components['schemas']['UpdatePlaylistRequestPayload']

export const EditPlaylistForm = ({ playlistId, onCancelEditing, classNames }: Props) => {
  const queryClient = useQueryClient()

  /* 1. Загружаем детали плейлиста */
  const { data: playlistResp, isPending: isPlaylistPending } = useQuery({
    queryKey: ['playlists', 'details', playlistId],
    queryFn: ({ signal }) =>
      getClient().GET('/playlists/{playlistId}', {
        params: { path: { playlistId: playlistId! } },
        signal,
      }),
    enabled: Boolean(playlistId),
  })

  /* 2. useForm */
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<UpdatePlaylistRequestPayload>({
    defaultValues: { title: '', description: '' }, // дефолты
  })

  /* 3. Сброс/инициализация формы, когда данные загрузились */
  useEffect(() => {
    if (playlistResp?.data) {
      const { title = '', description = '' } = playlistResp.data.data.attributes
      reset({ title, description })
    }
  }, [playlistResp, reset])

  /* 4. Мутация «обновить плейлист» */
  const { mutate, isPending } = useMutation({
    mutationFn: (body: UpdatePlaylistRequestPayload) =>
      requestWrapper(
        getClient().PUT('/playlists/{playlistId}', {
          body: { ...body, tagIds: [] },
          params: { path: { playlistId: playlistId! } },
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['playlists'],
      })
      onCancelEditing?.()
    },
    onError: queryErrorHandlerForRHFFactory({ setError }),
  })

  /* 5. Сабмит формы */
  const onSubmit: SubmitHandler<UpdatePlaylistRequestPayload> = (values) => {
    if (!playlistId) return
    mutate(values)
  }

  if (!playlistId) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classNames}>
      <h2>Редактировать плейлист</h2>

      <p>
        <label>
          <input {...register('title')} placeholder="Title" disabled={isPending || isPlaylistPending || isSubmitting} />
        </label>
      </p>
      {errors.title && <p>{errors.title.message}</p>}
      <p>
        <label>
          <textarea
            {...register('description')}
            placeholder="Description"
            disabled={isPending || isPlaylistPending || isSubmitting}
          />
        </label>
      </p>
      {errors.description && <p>{errors.description.message}</p>}

      <button type="submit" disabled={isPending || isPlaylistPending || isSubmitting}>
        {isPending ? 'Сохраняем…' : 'Сохранить'}
      </button>

      {errors.root?.server && <p>{errors.root.server.message}</p>}

      <button onClick={() => onCancelEditing?.()}>Cancel</button>
    </form>
  )
}
