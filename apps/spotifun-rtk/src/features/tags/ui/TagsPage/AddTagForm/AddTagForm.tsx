import { type SubmitHandler, useForm } from "react-hook-form"
import { useCreateTagMutation } from "../../../api/tagsApi.ts"

type Inputs = {
  value: string
}

export const AddTagForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>({ defaultValues: { value: "" } })

  const [createTag, { isLoading }] = useCreateTagMutation()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createTag({ name: data.value }).then(() => {
      reset()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register("value")} placeholder="Введите название тега" />
      </div>
      <button disabled={isLoading}>Создать тег</button>
    </form>
  )
}
