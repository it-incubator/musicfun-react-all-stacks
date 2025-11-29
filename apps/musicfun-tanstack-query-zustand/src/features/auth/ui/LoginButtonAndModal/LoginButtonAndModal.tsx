import { useState } from 'react'

import { LoginModal } from '@/features/auth/ui/LoginModal'
import { Button } from '@/shared/components/Button'

export const LoginButtonAndModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  return (
    <>
      <Button variant="primary" onClick={handleOpenModal}>
        Sign in
      </Button>
      {isOpen && <LoginModal onClose={handleCloseModal} />}
    </>
  )
}
