import { type SubmitHandler, useForm } from "react-hook-form"
import { useCreateArtistMutation } from "../../../api/artistsApi.ts"

type Inputs = {
  name: string
}

export const AddArtistForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>()
  const [createArtist, { isLoading }] = useCreateArtistMutation()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createArtist(data.name)
      .unwrap()
      .then(() => reset())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register("name")} placeholder="Введите имя артиста" />
      </div>
      <button disabled={isLoading}>Создать исполнителя</button>
    </form>
  )
}
