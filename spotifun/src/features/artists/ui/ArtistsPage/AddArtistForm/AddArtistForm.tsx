import { ArtistQueryKey, artistsApi } from "@/features/artists/api/artistsApi.ts"
import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

export const AddArtistForm = () => {
  const { register, handleSubmit, reset } = useForm<{ name: string }>()

  const { mutate } = useMutation({
    mutationFn: artistsApi.createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ArtistQueryKey] })
      reset()
    },
  })

  const onSubmit: SubmitHandler<{ name: string }> = (data) => {
    mutate(data.name)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register("name")} placeholder="Введите имя артиста" />
      </div>
      <button>Создать исполнителя</button>
    </form>
  )
}
