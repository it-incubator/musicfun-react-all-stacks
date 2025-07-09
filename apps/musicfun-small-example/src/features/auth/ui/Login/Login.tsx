import { useLoginMutation } from '../../api/use-login.mutation.ts'
import { getOauthRedirectUrl } from '../../api/authApi.types.ts'

const currentDomain = import.meta.env.VITE_CURRENT_DOMAIN

export const Login = () => {
  const { mutate } = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = currentDomain + '/oauth/callback' // todo: to config
    const url = getOauthRedirectUrl(redirectUri)
    window.open(url, 'oauthPopup', 'width=500,height=600')

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== currentDomain) {
        // todo: to config
        return
      }

      const { code } = event.data
      if (code) {
        console.log('✅ code received:', code)
        // тут можно вызвать setToken(accessToken) или dispatch(login)
        //popup?.close()
        window.removeEventListener('message', receiveMessage)
        mutate({ code, accessTokenTTL: '10s', redirectUri, rememberMe: true })
      }
    }

    window.addEventListener('message', receiveMessage)
  }

  return <button onClick={loginHandler}>Login with apihub</button>
}
