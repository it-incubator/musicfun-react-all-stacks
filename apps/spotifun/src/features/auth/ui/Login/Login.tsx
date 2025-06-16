import { authApi, localStorageKeys } from "@it-incubator/spotifun-api-sdk"
import { useMe } from "../../api/useMe.ts"

export const Login = () => {
  const loginHandler = () => {
    const redirectUri = "http://localhost:5174/oauth/callback" // todo: to config
    const url = authApi.oauthUrl(redirectUri)
    const popup = window.open(url, "oauthPopup", "width=500,height=600")

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== "http://localhost:5174") {
        // todo: to config
        throw new Error("incorrect origin parameter")
      }

      const { code } = event.data
      if (code) {
        console.log("✅ code received:", code)
        // тут можно вызвать setToken(accessToken) или dispatch(login)
        popup?.close()
        window.removeEventListener("message", receiveMessage)
        const tokens = await authApi.login({ code, accessTokenTTL: "3m", redirectUri, rememberMe: true })
        localStorage.setItem(localStorageKeys.refreshToken, tokens.data.refreshToken)
        localStorage.setItem(localStorageKeys.accessToken, tokens.data.accessToken)
        invalidate()
      }
    }

    window.addEventListener("message", receiveMessage)
  }

  const { invalidate } = useMe()

  return <button onClick={loginHandler}>Login with apihub</button>
}
