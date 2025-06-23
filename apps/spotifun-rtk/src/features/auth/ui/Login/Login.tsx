import { getOauthUrl, useLoginMutation } from "@/features/auth/api/auth-api.ts"
import { Path } from "@/common/routing/Routing.tsx"

export const Login = () => {
  const [mutate] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = 'http://localhost:5175' + Path.OAuthRedirect // todo: to config
    const url = getOauthUrl(redirectUri)
    window.open(url, "oauthPopup", "width=500,height=600")

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== "http://localhost:5175") {
        // todo: to config
        return
        // throw new Error("incorrect origin parameter")
      }

      const { code } = event.data
      if (code) {
        console.log("✅ code received:", code)
        // тут можно вызвать setToken(accessToken) или dispatch(login)
        //popup?.close()
        window.removeEventListener("message", receiveMessage)
        mutate({ code, accessTokenTTL: "3m", redirectUri, rememberMe: true })
      }
    }

    window.addEventListener("message", receiveMessage)
  }

  return <button onClick={loginHandler}>Login with apihub</button>
}
