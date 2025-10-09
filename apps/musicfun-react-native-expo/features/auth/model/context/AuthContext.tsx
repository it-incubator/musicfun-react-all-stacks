import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { tokenStorage } from '@/shared/storage/tokenStorage'
import { useLoginMutation } from '@/features/auth/model/api/hooks/use-login-mutatuion'
import { useLogoutMutation } from '@/features/auth/model/api/hooks/use-logout-mutation'

type LoginParams = { code: string; redirectUri: string }
type AuthContextT = {
  accessToken: string | null
  isAuth: boolean
  isPending: boolean
  isLogoutPending: boolean
  login: (params: LoginParams) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextT | undefined>(undefined)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [booted, setBooted] = useState(false)
  const qc = useQueryClient()
  const { mutateAsync: loginMutation, isPending } = useLoginMutation()
  const { mutateAsync: logoutMutation, isPending: isLogoutPending } = useLogoutMutation()

  useEffect(() => {
    const init = async () => {
      const token = await tokenStorage.getAccess()
      setAccessToken(token)
      setBooted(true)
    }
    init().then((r) => r)
  }, [])

  const login = async ({ code, redirectUri }: LoginParams) => {
    const data = await loginMutation({ code, redirectUri })
    await tokenStorage.set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
    setAccessToken(data.accessToken)
  }

  const logout = async () => {
    await logoutMutation()
    await tokenStorage.clear()
    setAccessToken(null)
    await qc.resetQueries()
  }

  if (!booted) return null
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuth: !!accessToken,
        login,
        logout,
        isPending,
        isLogoutPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) console.warn('контекст AuthContext не найден')
  return ctx
}
