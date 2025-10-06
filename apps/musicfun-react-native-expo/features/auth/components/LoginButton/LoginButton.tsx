import { View, StyleSheet } from 'react-native'
import { Button } from '@/shared/ui/Button/Button'
import { Fragment } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { API_ROOT, VERSION_ROOT } from '@/shared/api/api-root/api-root'
import * as AuthSession from 'expo-auth-session'
import { useLoginMutation } from '@/features/auth/model/api/hooks/use-login-mutatuion'

type LoginButtonPropsT = {}

WebBrowser.maybeCompleteAuthSession()

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'musicfun',
})
const redirectUriExpo = redirectUri + '/oauth/callback'
console.log('redirectUriExpo', redirectUriExpo)
const AUTH_URL = `${API_ROOT}${VERSION_ROOT}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUriExpo)}`

export const LoginButton = ({}: LoginButtonPropsT) => {
  const { mutate, isPending } = useLoginMutation()

  const onPressLogin = async () => {
    const res = await WebBrowser.openAuthSessionAsync(AUTH_URL, redirectUriExpo)
    if (res.type !== 'success' || !('url' in res)) return
    const url = res.url
    const code = new URL(url).searchParams.get('code')
    if (!code) return
    console.log('res', res)
    console.log('start mutate with code:' + code)
    mutate({ code, redirectUri: redirectUriExpo })
  }

  return (
    <Fragment>
      <Button disabled={isPending} isFull onPress={onPressLogin} title="Sign up with APIHUB" />
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {},
})
