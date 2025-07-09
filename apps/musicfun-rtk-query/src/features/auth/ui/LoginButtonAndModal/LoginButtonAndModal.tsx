import clsx from 'clsx'
import { useState } from 'react'

import { Button } from '@/shared/components/Button'
import { Dialog, DialogContent, DialogHeader } from '@/shared/components/Dialog'
import { Typography } from '@/shared/components/Typography'
import { Paths } from '@/shared/configs'

import { useLoginMutation } from '../../api/auth-api'
import s from './LoginButtonAndModal.module.css'

export const LoginButtonAndModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  const [mutate] = useLoginMutation()

  /**
   * Handles the OAuth login process via popup window.
   * Opens the OAuth authorization popup, listens for the authorization code,
   * and triggers the login mutation when the code is received.
   */
  const loginHandler = () => {
    const redirectUri = `${import.meta.env.VITE_DOMAIN_ADDRESS}${Paths.OAuthRedirect}`
    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`
    window.open(url, 'oauthPopup', 'width=500,height=600')

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

      const { code } = event.data
      if (code) {
        window.removeEventListener('message', receiveMessage)
        mutate({ code, accessTokenTTL: '3m', redirectUri, rememberMe: true })
        handleCloseModal()
      }
    }

    window.addEventListener('message', receiveMessage)
  }

  return (
    <>
      <Button variant="primary" onClick={handleOpenModal}>
        Sign in
      </Button>

      <Dialog open={isOpen} onClose={handleCloseModal} className={s.dialog}>
        <DialogHeader />

        <DialogContent className={s.content}>
          <Typography variant="h2">
            Millions of Songs. <br /> Free on Musicfun.
          </Typography>

          <div className={s.icon}>😊</div>

          <Button className={clsx(s.button, s.secondary)} fullWidth onClick={handleCloseModal}>
            Continue without Sign in
          </Button>
          <Button className={s.button} variant="primary" fullWidth onClick={loginHandler}>
            Sign in with APIHub
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
