import { LOCALSTORAGE_KEYS } from "@/common/constants"

// Two login flows exist: OAuth (API Hub) and login/password. Each has its own refresh/logout endpoints
export type AuthMethod = "oauth" | "simple"

export type Tokens = { accessToken: string; refreshToken: string }

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  getRefreshToken: () => localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  getAuthMethod: (): AuthMethod =>
    localStorage.getItem(LOCALSTORAGE_KEYS.authMethod) === "oauth" ? "oauth" : "simple",
  save: (tokens: Tokens, method?: AuthMethod) => {
    localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, tokens.accessToken)
    localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, tokens.refreshToken)
    if (method) localStorage.setItem(LOCALSTORAGE_KEYS.authMethod, method)
  },
  clear: () => {
    localStorage.removeItem(LOCALSTORAGE_KEYS.accessToken)
    localStorage.removeItem(LOCALSTORAGE_KEYS.refreshToken)
    localStorage.removeItem(LOCALSTORAGE_KEYS.authMethod)
  },
}

export const authEndpoints = {
  refresh: (method: AuthMethod) => (method === "oauth" ? "auth/refresh" : "auth/simple/refresh"),
  logout: (method: AuthMethod) => (method === "oauth" ? "auth/logout" : "auth/simple/logout"),
}
