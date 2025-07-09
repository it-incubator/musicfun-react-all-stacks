import clsx from 'clsx'
import { useState } from 'react'

import { Button } from '@/shared/components/Button'
import { Dialog, DialogContent, DialogHeader } from '@/shared/components/Dialog'
import { Typography } from '@/shared/components/Typography'

import s from './LoginButtonAndModal.module.css'

export const LoginButtonAndModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

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
          <Button
            as="a"
            href="https://apihub.it-incubator.io/en/login"
            target="_blank"
            className={s.button}
            variant="primary"
            fullWidth
            onClick={handleCloseModal}>
            Sign in with APIHub
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
