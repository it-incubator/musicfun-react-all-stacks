import { queryClient } from "@/main.tsx"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { tagsApi, TagsQueryKey } from "../../../api/tagsApi.ts"

type Inputs = {
  value: string
}

export const AddTagForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>()

  const { mutate, isPending } = useMutation({
    mutationFn: tagsApi.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TagsQueryKey] })
      reset()
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data.value)
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
