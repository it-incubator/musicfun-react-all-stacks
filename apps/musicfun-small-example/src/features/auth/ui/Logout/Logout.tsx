import { useLogoutMutation } from '../../api/use-logout.mutation.ts'

export const Logout = () => {
  const { mutate } = useLogoutMutation()

  const logoutHandler = () => {
    mutate()
  }

  return <button onClick={logoutHandler}>logout</button>
}
