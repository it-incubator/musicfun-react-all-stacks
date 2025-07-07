import { useLogoutMutation } from '../../api/useLogoutMutation.ts'

export const Logout = () => {
  const { mutate } = useLogoutMutation()

  const logoutHandler = () => {
    mutate()
  }

  return <button onClick={logoutHandler}>logout</button>
}
