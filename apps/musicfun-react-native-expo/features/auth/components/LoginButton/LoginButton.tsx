import { Button } from '@/shared/ui/Button/Button'
import { Fragment } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { API_ROOT, VERSION_ROOT } from '@/shared/api/api-root/api-root'
import * as AuthSession from 'expo-auth-session'
import { useAuthContext } from '@/features/auth/model/context/AuthContext'

type LoginButtonPropsT = {}

WebBrowser.maybeCompleteAuthSession()

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'musicfun',
})
export const redirectUriExpo = redirectUri + '/oauth/callback'
const AUTH_URL = `${API_ROOT}${VERSION_ROOT}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUriExpo)}`

export const LoginButton = ({}: LoginButtonPropsT) => {
  const { login, isPending } = useAuthContext()

  const onPressLogin = async () => {
    const res = await WebBrowser.openAuthSessionAsync(AUTH_URL, redirectUriExpo)
    if (res.type !== 'success' || !('url' in res)) return
    const url = res.url
    const code = new URL(url).searchParams.get('code')
    if (!code) return

    await login({ code, redirectUri: redirectUriExpo })
  }

  return (
    <Fragment>
      <Button disabled={isPending} isFull onPress={onPressLogin} title="Sign up with APIHUB" />
    </Fragment>
  )
}
