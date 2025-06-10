import { useLogoutMutation } from "../../api/useLogoutMutation.ts"

export const Logout = () => {
  const { mutate } = useLogoutMutation()

  const logoutHandler = () => {
    alert("работает пока некорректно.. ждём апдейта бекенда. Можно пока почистить в ls токены руками")
    mutate()
  }

  return <button onClick={logoutHandler}>logout</button>
}
