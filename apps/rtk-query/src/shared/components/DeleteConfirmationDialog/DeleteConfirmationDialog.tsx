import { useTranslation } from 'react-i18next'

import { Typography } from '@/shared/components'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog'
import s from './DeleteConfirmationDialog.module.css'

export type EntityType = 'playlist' | 'track'

export type DeleteConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  entityName: string
  entityType: EntityType
  isLoading?: boolean
  showCloseButton?: boolean
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  entityName,
  entityType,
  onConfirm,
  isLoading,
  showCloseButton = true,
}: DeleteConfirmationDialogProps) => {
  const { t } = useTranslation()

  const deleteQuestionKey =
    entityType === 'playlist' ? 'confirm.deletePlaylistQuestion' : 'confirm.deleteTrackQuestion'

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onClose={handleClose} className={s.content}>
      <DialogHeader className={s.header} showCloseButton={showCloseButton}>
        <Typography variant="body1" className={s.title}>
          {t(deleteQuestionKey)}
        </Typography>
      </DialogHeader>

      <DialogContent className={s.body}>
        <Typography variant="body1" className={s.entityName}>
          {entityName}
        </Typography>
      </DialogContent>

      <DialogFooter className={s.footer}>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isLoading}
          className={s.cancelButton}>
          {t('button.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isLoading}
          className={s.confirmButton}>
          {t('button.delete')}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
