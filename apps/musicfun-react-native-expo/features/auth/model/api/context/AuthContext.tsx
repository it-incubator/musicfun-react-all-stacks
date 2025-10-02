import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type AuthContextT = {
  accessToken: string | null
  login: (code: string, redirectUri: string) => Promise<void>
  logout: () => void
  isAuth: boolean
}

const AuthContext = createContext<AuthContextT | undefined>(undefined)
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const login = async (code: string, redirectUri: string) => {
    console.log('mock login', code, redirectUri)
    setAccessToken('MOCK_TOKEN')
  }

  const logout = () => {
    console.log('mock logout')
    setAccessToken(null)
  }

  const value: AuthContextT = {
    accessToken,
    isAuth: !!accessToken,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('контекст AuthContext не найден')
  }
  return context
}
