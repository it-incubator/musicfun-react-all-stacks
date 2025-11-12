import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { setIsAuthModalOpen } from '@/features/auth'
import { useLoginMutation } from '@/features/auth'
import { Button } from '@/shared/components/Button'
import { Dialog, DialogContent, DialogHeader } from '@/shared/components/Dialog'
import { Typography } from '@/shared/components/Typography'
import { Paths } from '@/shared/configs'
import { useAppDispatch } from '@/shared/hooks'

import s from './LoginModal.module.css'

export const LoginModal = () => {
  const { t } = useTranslation()

  const [mutate] = useLoginMutation()

  const dispatch = useAppDispatch()

  const handleCloseAuthModal = () => {
    dispatch(setIsAuthModalOpen({ isAuthModalOpen: false }))
  }

  /**
   * Handles the OAuth login process via popup window.
   * Opens the OAuth authorization popup, listens for the authorization code,
   * and triggers the login mutation when the code is received.
   */
  const loginHandler = () => {
    const redirectUri = `${window.location.origin}/rtkquery${Paths.OAuthRedirect}`
    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`
    window.open(url, 'oauthPopup', 'width=500,height=600')

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      const { code } = event.data
      if (code) {
        window.removeEventListener('message', receiveMessage)
        mutate({
          code,
          accessTokenTTL: '3m',
          redirectUri,
          rememberMe: true,
        })
        handleCloseAuthModal()
      }
    }

    window.addEventListener('message', receiveMessage)
  }

  return (
    <Dialog open onClose={handleCloseAuthModal} className={s.dialog}>
      <DialogHeader />

      <DialogContent className={s.content}>
        <Typography variant="h2">
          Millions of Songs. <br /> Free on Musicfun.
        </Typography>

        <div className={s.icon}>😊</div>

        <Button className={clsx(s.button, s.secondary)} fullWidth onClick={handleCloseAuthModal}>
          {t('auth.button.continue_without_sign_in')}
        </Button>
        <Button className={s.button} variant="primary" fullWidth onClick={loginHandler}>
          {t('auth.button.sign_in_with_apihub')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
