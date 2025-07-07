import { Path } from "@/common/routing"
import { useLoginMutation } from "@/features/auth/api/authApi"
import Button from "@mui/material/Button"
import s from "./Login.module.css"

export const Login = () => {
  const [mutate] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect
    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

    window.open(url, "oauthPopup", "width=500,height=600")

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

      const { code } = event.data
      if (!code) return

      window.removeEventListener("message", receiveMessage)
      mutate({ code, accessTokenTTL: "3m", redirectUri, rememberMe: false })
    }

    window.addEventListener("message", receiveMessage)
  }

  return (
    <div className={s.wrapper}>
      <h1>Trelly</h1>
      <div className={s.container}>
        <Button variant="contained" color="secondary" component={"a"} href={Path.Main}>
          Сontinue without Sign In
        </Button>
        <Button variant="contained" color="primary" onClick={loginHandler}>
          Login with APIHUB
        </Button>
      </div>
    </div>
  )
}
