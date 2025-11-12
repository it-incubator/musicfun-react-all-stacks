import { authEndpoint } from '@/common/apiEntities'
import { Path } from '@/common/routing/Routing.tsx'
import { useLoginMutation } from '@/features/auth/api/auth-api.ts'
import { useState } from 'react'
import { LoginModal } from '../LoginModal/LoginModal'
import s from './Login.module.scss'

export const Login = () => {
  const [openModal, setOpenModal] = useState(false)

  const [mutate] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect
    const url = `${import.meta.env.VITE_BASE_URL}/${authEndpoint}/oauth-redirect?callbackUrl=${redirectUri}`
    window.open(url, 'oauthPopup', 'width=500,height=600')

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

      const { code } = event.data
      if (code) {
        window.removeEventListener('message', receiveMessage)
        mutate({ code, accessTokenTTL: '3m', redirectUri, rememberMe: true })
        setOpenModal(false)
      }
    }

    window.addEventListener('message', receiveMessage)
  }

  return (
    <>
      <LoginModal open={openModal} onClose={() => setOpenModal(false)} onClick={loginHandler} />
      <button className={s.login} onClick={() => setOpenModal(true)}>
        Login with apihub
      </button>
    </>
  )
}
