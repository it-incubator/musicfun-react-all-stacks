interface TokenData {
  accessToken: string
}

interface RefreshTokenData {
  refreshToken: string
}

interface AuthStorage {
  saveAccessToken: (accessToken: string) => void
  getAccessToken: () => string | null
  clearAccessToken: () => void
  clearTokens: () => void
  saveRefreshToken: (refreshToken: string) => void
  getRefreshToken: () => string | null
  clearRefreshToken: () => void
}

export const authStorage: AuthStorage = {
  saveAccessToken(accessToken: string) {
    localStorage.setItem(localStorageKeys.accessToken, JSON.stringify({ accessToken }))
  },
  getAccessToken() {
    const tokenString = localStorage.getItem(localStorageKeys.accessToken)
    if (tokenString) {
      const token = JSON.parse(tokenString) as TokenData
      return token.accessToken
    }
    return null
  },
  clearAccessToken() {
    localStorage.removeItem(localStorageKeys.accessToken)
  },

  clearTokens() {
    this.clearAccessToken()
    this.clearRefreshToken()
  },
  saveRefreshToken(refreshToken: string) {
    localStorage.setItem(localStorageKeys.refreshToken, JSON.stringify({ refreshToken }))
  },
  getRefreshToken() {
    const tokenString = localStorage.getItem(localStorageKeys.refreshToken)
    if (tokenString) {
      const token = JSON.parse(tokenString) as RefreshTokenData
      return token.refreshToken
    }
    return null
  },
  clearRefreshToken() {
    localStorage.removeItem(localStorageKeys.refreshToken)
  },
}

const localStorageKeys = {
  refreshToken: 'musicfun-refresh-token',
  accessToken: 'musicfun-access-token',
}
