import { authApi } from "../../api/authApi.ts"
import { localStorageKeys } from "../../api/authApi.types.ts"
import { useMe } from "../../api/useMe.ts"

export const Login = () => {
  const { invalidate } = useMe()

  const loginHandler = () => {
    const redirectUri = "http://localhost:5174/oauth/callback" // TODO: to config
    const url = authApi.oauthUrl(redirectUri)
    window.open(url, "oauthPopup", "width=500,height=600")

    const receiveMessage = async (event: MessageEvent) => {
      // TODO: to config
      if (event.origin !== "http://localhost:5174") {
        return
      }

      const { code } = event.data
      if (code) {
        console.log("✅ code received:", code)
        // тут можно вызвать setToken(accessToken) или dispatch(login)
        window.removeEventListener("message", receiveMessage)
        const tokens = await authApi.login({ code, accessTokenTTL: "3m", redirectUri, rememberMe: true })
        localStorage.setItem(localStorageKeys.refreshToken, tokens.data.refreshToken)
        localStorage.setItem(localStorageKeys.accessToken, tokens.data.accessToken)
        invalidate()
      }
    }

    window.addEventListener("message", receiveMessage)
  }

  return <button onClick={loginHandler}>Login with apihub</button>
}
