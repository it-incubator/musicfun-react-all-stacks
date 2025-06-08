import { useLogoutMutation, useMe } from "@/features/auth/api/hooks.ts"

export const MeInfo = () => {
  const {
    query: { data },
  } = useMe()

  return (
    <span>
      userLogin: {data?.data.login} <Logout />
    </span>
  )
}

export const Logout = () => {
  const { mutate } = useLogoutMutation()

  return (
    <button
      onClick={() => {
        alert("работает пока некорректно.. ждём апдейта бекенда. Можно пока почистить в ls токены руками")
        mutate()
      }}
    >
      logout
    </button>
  )
}
