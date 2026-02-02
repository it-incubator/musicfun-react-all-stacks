import { useState } from 'react'

import { LoginModal } from '@/features/auth/ui/LoginModal'
import { Button } from '@/shared/components/Button'
import { useTranslation } from 'react-i18next'

export const LoginButtonAndModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  return (
    <>
      <Button variant="primary" onClick={handleOpenModal}>
        {t('auth.button.sign_in')}
      </Button>
      {isOpen && <LoginModal onClose={handleCloseModal} />}
    </>
  )
}
