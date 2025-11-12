import { authApi } from '@/shared/api/auth-api'
import { redirectAfterOauthUri } from '@/shared/api/base'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createAccessTokenCookie, createRefreshTokenCookie } from '@/shared/utils/cookieHelpers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code') as string

  const tokens = await authApi.login({
    code,
    redirectUri: redirectAfterOauthUri,
    accessTokenTTL: '1d',
    rememberMe: true,
  })

  const cookieStore = await cookies()

  cookieStore.set(createRefreshTokenCookie(tokens.refreshToken))
  cookieStore.set(createAccessTokenCookie(tokens.accessToken))

  return NextResponse.redirect(new URL('/', request.url), 307)
}
