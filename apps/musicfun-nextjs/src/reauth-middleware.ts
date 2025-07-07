import { NextRequest, NextResponse } from 'next/server'
import { authApi } from '@/shared/api/auth-api'
import { getJwtExpirationMaxAge, getSecondsToExpiration } from '@/shared/utils/jwt-util'
import { createAccessTokenCookie, createRefreshTokenCookie } from '@/shared/utils/cookieHelpers'

const refreshTokens = async (refreshToken: string) => {
  try {
    const { accessToken, refreshToken: newRefreshToken } = await authApi.refreshToken({ refreshToken })
    return { accessToken, refreshToken: newRefreshToken }
  } catch {
    return null
  }
}

export async function reauthMiddleware(request: NextRequest) {
  const accessCookie = request.cookies.get('access-token')
  const refreshCookie = request.cookies.get('refresh-token')
  let tokens: { accessToken: string; refreshToken: string } | null = null

  if (accessCookie) {
    const secondsToExpiration = getSecondsToExpiration(accessCookie.value)
    if (secondsToExpiration < 20 && refreshCookie) {
      tokens = await refreshTokens(refreshCookie.value)
    }
  } else if (refreshCookie) {
    tokens = await refreshTokens(refreshCookie.value)
  }

  const requestHeaders = new Headers(request.headers)
  if (tokens) {
    requestHeaders.set('Authorization', 'Bearer ' + tokens.accessToken)
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  if (tokens) {
    response.cookies.set(createAccessTokenCookie(tokens.accessToken))
    response.cookies.set(createRefreshTokenCookie(tokens.accessToken))
  }

  return response
}
