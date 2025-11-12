import React, { createContext, useContext, useState } from 'react'
import { API_BASE_URL } from '../../env'

interface AuthContextValue {
  accessToken: string | null
  login: (code: string, redirectUri: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const login = async (code: string, redirectUri: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirectUri,
        rememberMe: true,
      }),
    })
    if (!res.ok) throw new Error('Failed to login')
    const data = await res.json()
    setAccessToken(data.accessToken)
  }

  const logout = () => setAccessToken(null)

  return <AuthContext.Provider value={{ accessToken, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider')
  return ctx
}
