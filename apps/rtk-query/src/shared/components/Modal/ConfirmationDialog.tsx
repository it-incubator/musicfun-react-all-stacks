import {Dialog, DialogContent, DialogFooter, DialogHeader} from '../Dialog'
import {Button} from '../Button'
import {Typography} from '../Typography/Typography'
import s from './ConfrirmDialog.module.css'
import {useTranslation} from "react-i18next";
import {useConfirmMessage} from "@/shared/hooks/useConfirmMessage.ts";


export type EntityType = 'playlist' | 'track'

export type ConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  entityName: string
  entityType: EntityType
  isLoading?: boolean
}


export const ConfirmationDialog = ({
                                     open,
                                     onOpenChange,
                                     entityName,
                                     entityType,
                                     onConfirm,
                                     isLoading,
                                   }: ConfirmationDialogProps) => {
  const {t} = useTranslation()
  const {getConfirmMessage} = useConfirmMessage()
  const message = getConfirmMessage({entityType, entityName})

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className={s.content}>
        <Typography variant="body1" className={s.message}>
          {message}
        </Typography>
      </DialogContent>

      <DialogFooter className={s.footer}>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isLoading}
          className={s.cancelButton}
        >
          {t("button.cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isLoading}
          className={s.confirmButton}
        >
          {t("button.delete")}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}