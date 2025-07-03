import { getOauthUrl, useLoginMutation } from "@/features/auth/api/auth-api.ts"
import { Path } from "@/common/routing/Routing.tsx"
import s from "./Login.module.scss"
import { LoginModal } from "../LoginModal/LoginModal"
import { useState } from "react"

export const Login = () => {
  const [openModal, setOpenModal] = useState(false)

  const [mutate] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = "http://localhost:5175" + Path.OAuthRedirect // todo: to config
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
        setOpenModal(false)
      }
    }

    window.addEventListener("message", receiveMessage)
  }

  return (
    <>
      <LoginModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        onClick={loginHandler}
      />
      <button className={s.login} onClick={() => setOpenModal(true)}>
        Login with apihub
      </button>
    </>
  )
}
