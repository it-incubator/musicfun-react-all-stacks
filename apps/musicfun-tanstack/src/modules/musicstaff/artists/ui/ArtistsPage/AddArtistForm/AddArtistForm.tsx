import { artistsKey } from '@/common/apiEntities'
import { artistsApi } from '../../../api/artistsApi.ts'
import { queryClient } from '@/main.tsx'
import { useMutation } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  name: string
}

export const AddArtistForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>()

  const { mutate, isPending } = useMutation({
    mutationFn: artistsApi.createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [artistsKey] })
      reset()
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data.name)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register('name')} placeholder="Введите имя артиста" />
      </div>
      <button disabled={isPending}>Создать исполнителя</button>
    </form>
  )
}
