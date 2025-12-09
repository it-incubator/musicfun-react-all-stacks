// src/shared/utils/cookieHelpers.ts

import { getJwtExpirationMaxAge } from '@/shared/utils/jwt-util'

export interface CookieDef {
  name: string
  value: string
  httpOnly: boolean
  maxAge: number
  path: string
}

/**
 * Возвращает определение cookie для access-token
 */
export function createAccessTokenCookie(token: string): CookieDef {
  return {
    name: 'access-token',
    value: token,
    httpOnly: true,
    maxAge: getJwtExpirationMaxAge(token),
    path: '/',
  }
}

/**
 * Возвращает определение cookie для refresh-token
 */
export function createRefreshTokenCookie(token: string): CookieDef {
  return {
    name: 'refresh-token',
    value: token,
    httpOnly: true,
    maxAge: getJwtExpirationMaxAge(token),
    path: '/',
  }
}
