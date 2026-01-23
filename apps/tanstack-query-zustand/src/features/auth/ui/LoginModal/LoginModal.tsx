import clsx from 'clsx'

import { useLoginMutation } from '@/features/auth/api/use-login.mutation.ts'
import { getOauthRedirectUrl } from '@/features/auth/types/auth-api.types.ts'
import s from '@/features/auth/ui/LoginModal/LoginModal.module.css'
import { Button, Dialog, DialogContent, DialogHeader, Typography } from '@/shared/components'
import { CURRENT_APP_DOMAIN } from '@/shared/config/config.ts'
import { joinUrl } from '@/shared/utils/join-url.ts'
import { useTranslation } from 'react-i18next'

type Props = {
  onClose: () => void
}

export const LoginModal = ({ onClose }: Props) => {
  const { mutate } = useLoginMutation()
  const { t } = useTranslation()

  const loginHandler = () => {
    const segments = [window.location.origin]
    if (CURRENT_APP_DOMAIN) {
      segments.push(CURRENT_APP_DOMAIN)
    }
    segments.push('oauth/callback')

    const redirectUri = joinUrl(...segments)
    const url = getOauthRedirectUrl(redirectUri)
    window.open(url, 'oauthPopup', 'width=500,height=600')

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      const { code } = event.data
      if (code) {
        console.log('✅ code received:', code)
        // тут можно вызвать setToken(accessToken) или dispatch(login)
        //popup?.close()
        window.removeEventListener('message', receiveMessage)
        mutate({
          code,
          accessTokenTTL: '10s',
          redirectUri,
          rememberMe: true,
        })
        onClose()
      }
    }

    window.addEventListener('message', receiveMessage)
  }

  return (
    <Dialog open onClose={onClose} className={s.dialog}>
      <DialogHeader />

      <DialogContent className={s.content}>
        <Typography variant="h2">{t('auth.modal.title')}</Typography>

        <div className={s.icon}>😊</div>

        <Button className={clsx(s.button, s.secondary)} fullWidth onClick={onClose}>
          {t('auth.button.continue_without_sign_in')}
        </Button>
        <Button
          as="button"
          target="_blank"
          className={s.button}
          variant="primary"
          fullWidth
          onClick={loginHandler}>
          {t('auth.button.sign_in_with_apihub')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
