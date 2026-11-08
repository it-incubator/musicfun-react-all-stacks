import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import type { ReactNode } from "react"

type Props = {
  open: boolean
  title: string
  description?: ReactNode
  confirmText?: string
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmDialog = ({ open, title, description, confirmText = "Delete", onConfirm, onClose }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    {description && (
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
    )}
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} color="inherit">
        Cancel
      </Button>
      <Button
        onClick={() => {
          onConfirm()
          onClose()
        }}
        color="error"
        variant="contained"
      >
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
)
