import { type SubmitHandler, useForm } from 'react-hook-form'
import { useCreateTagMutation } from '../../../api/tagsApi.ts'
import { errorHandler } from '@/common/utils/errorHandler.ts'

type Inputs = {
  name: string
}

export const AddTagForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { name: '' } })

  const [createTag, { isLoading }] = useCreateTagMutation()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createTag({ name: data.name })
      .unwrap()
      .then(() => {
        reset()
      })
      .catch((e) => errorHandler(e, setError))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register('name')} placeholder="Введите название тега" />
        <span className="error">{errors.name?.message}</span>
      </div>
      <button disabled={isLoading}>Создать тег</button>
    </form>
  )
}
