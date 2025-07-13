import { useLoginMutation } from '../../api/use-login.mutation.ts'
import { getOauthRedirectUrl } from '../../api/auth-api.types.ts'

const currentDomain = import.meta.env.VITE_CURRENT_DOMAIN

export const useLogin = () => {
  const { mutate } = useLoginMutation()

  function login() {
    const redirectUri = currentDomain + '/oauth/callback' // todo: to config
    const url = getOauthRedirectUrl(redirectUri)
    window.open(url, 'oauthPopup', 'width=500,height=600')

    const handleOauthMessage = async (event: MessageEvent) => {
      if (event.origin !== currentDomain) {
        return
      }

      const { code } = event.data
      if (code) {
        console.log('✅ code received:', code)
        window.removeEventListener('message', handleOauthMessage)
        mutate({ code, accessTokenTTL: '10s', redirectUri, rememberMe: true })
      }
    }

    window.addEventListener('message', handleOauthMessage)
  }

  return { login }
}
