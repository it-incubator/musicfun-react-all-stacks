import { useLogoutMutation } from '@/features/auth/api/auth-api.ts'

export const Logout = () => {
  const [mutate] = useLogoutMutation()

  const logoutHandler = () => {
    mutate()
  }

  return <button onClick={logoutHandler}>logout</button>
}
