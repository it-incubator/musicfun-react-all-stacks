import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getClient } from '../../../shared/api/client.ts'
import type { components } from '../../../shared/api/schema.ts'
import { requestWrapper } from '../../../shared/api/request-wrapper.ts'

export type CreatePlaylistRequestPayload = components['schemas']['CreatePlaylistRequestPayload']

export const AddPlaylistForm = () => {
  // локальное состояние формы
  const [form, setForm] = useState<CreatePlaylistRequestPayload>({
    title: '',
    description: '',
  })

  const queryClient = useQueryClient()

  // мутация создания плейлиста
  const { mutate, isPending } = useMutation({
    mutationFn: (body: CreatePlaylistRequestPayload) =>
      requestWrapper(
        getClient().POST('/playlists', {
          body: body,
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      setForm({ title: '', description: '' }) // сброс полей
    },
    onError: (err: unknown) => {
      console.log('local')
      alert(JSON.stringify(err))
      throw err
    },
    meta: { globalErrorHandler: 'on' },
  })

  // обновляем поле по name
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // отправка формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить новый плейлист</h2>

      <div>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          disabled={isPending}
        />
      </div>

      <div>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          disabled={isPending}
        />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Создаём…' : 'Создать плейлист'}
      </button>
    </form>
  )
}
