import { useCreateTagMutation } from "../../../api/tagsApi.ts"
import { type SubmitHandler, useForm } from "react-hook-form"

type Inputs = {
  value: string
}

export const AddTagForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>()

  const [createTag, { isLoading: isPending}] = useCreateTagMutation()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createTag({ name: data.value})
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register("value")} placeholder="Введите название тега" />
      </div>
      <button disabled={isPending}>Создать тег</button>
    </form>
  )
}
