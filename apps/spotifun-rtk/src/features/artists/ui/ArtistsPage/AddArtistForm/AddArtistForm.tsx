import {type SubmitHandler, useForm} from 'react-hook-form'
import {useCreateArtistMutation} from '../../../api/artistsApi.ts'
import {errorHandler} from '@/common/utils/errorHandler.ts'

type Inputs = {
  name: string
}

export const AddArtistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: {errors},
  } = useForm<Inputs>()
  
  const [createArtist, {isLoading}] = useCreateArtistMutation()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createArtist(data.name)
      .unwrap()
      .then(() => reset())
      .catch((e) => {
        errorHandler(e, setError)
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Создать нового исполнителя</h2>
      <div>
        <input {...register('name')} placeholder='Введите имя артиста' />
        <span className='error'>{errors.name?.message}</span>
      </div>
      <button disabled={isLoading}>Создать исполнителя</button>
    </form>
  )
}
