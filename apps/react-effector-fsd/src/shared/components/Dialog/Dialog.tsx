import { clsx } from 'clsx'
import { createContext, type ReactNode, use, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { IconButton } from '../IconButton'
import s from './Dialog.module.css'

type DialogContextType = {
  onClose?: () => void
}

const DialogContext = createContext<DialogContextType | null>(null)

const useDialogContext = () => {
  const context = use(DialogContext)
  if (!context) {
    throw new Error('Dialog compound components must be used within Dialog component')
  }
  return context
}

export type DialogProps = {
  children: ReactNode
  open: boolean
  onClose?: () => void
  className?: string
}

export const Dialog = ({ children, open, onClose, className }: DialogProps) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  // Add global keydown handler for ESC key
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const dialogContent = (
    <div className={s.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <section className={clsx(s.dialog, className)}>
        <DialogContext value={{ onClose }}>{children}</DialogContext>
      </section>
    </div>
  )

  return createPortal(dialogContent, document.body)
}

/*
 * DialogHeader
 */

export type DialogHeaderProps = {
  children?: ReactNode
  className?: string
  showCloseButton?: boolean
}

export const DialogHeader = ({ children, className, showCloseButton = true }: DialogHeaderProps) => {
  const { onClose } = useDialogContext()

  return (
    <header className={clsx(s.header, className)}>
      <div>{children}</div>
      {showCloseButton && (
        <IconButton onClick={onClose} aria-label="Close dialog" type="button">
          ✕
        </IconButton>
      )}
    </header>
  )
}

/*
 * DialogContent
 */

export type DialogContentProps = {
  children: ReactNode
  className?: string
}

export const DialogContent = ({ children, className }: DialogContentProps) => {
  return <div className={clsx(s.content, className)}>{children}</div>
}

/*
 * DialogFooter
 */

export type DialogFooterProps = {
  children: ReactNode
  className?: string
}

export const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return <footer className={clsx(s.footer, className)}>{children}</footer>
}
