import type { AuthTokensResponse, MeResponseResponse, OAuthLoginArgs, RefreshTokensArgs } from './authApi.types'
import { baseUrl, jsonHeaders } from '@/shared/api/base'
import { cookies } from 'next/headers'

/**
 * Обёртка над fetch, которая проверяет response.ok
 */
async function checkResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Request failed with status ${response.status}: ${errorBody}`)
  }
  return (await response.json()) as T
}

export const authApi = {
  // 1) Login → POST /auth/login
  async login(payload: OAuthLoginArgs): Promise<AuthTokensResponse> {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    })
    return checkResponse<AuthTokensResponse>(response)
  },

  // 2) Logout → POST /auth/logout
  async logout(payload: RefreshTokensArgs): Promise<void> {
    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    })
    // не ожидаем JSON в ответе
    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Logout failed with status ${response.status}: ${errorBody}`)
    }
  },

  // 3) Получить URL для OAuth-редиректа (без сетевого запроса)
  oauthUrl(redirectUrl: string): string {
    // Здесь предполагается, что authEndpoint — это что-то вроде '/api/auth'

    return `${baseUrl}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUrl)}`
  },

  // 4) Refresh token → POST /auth/refresh
  async refreshToken(payload: RefreshTokensArgs): Promise<AuthTokensResponse> {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    })
    return checkResponse<AuthTokensResponse>(response)
  },

  // 5) Get current user → GET /auth/me
  async getMe(): Promise<MeResponseResponse> {
    const cookieStore = await cookies()
    const token = cookieStore.get('access-token')?.value

    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        ...jsonHeaders,
        Authorization: 'Bearer ' + token,
      },
      // Если нужен авторизационный заголовок — добавьте сюда:
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      // },
    })
    return checkResponse<MeResponseResponse>(response)
  },
}
