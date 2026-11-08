import Alert from "@mui/material/Alert"
import Portal from "@mui/material/Portal"
import Snackbar from "@mui/material/Snackbar"
import type { SyntheticEvent } from "react"

import { hideNotificationAC, selectNotification } from "@/app/model/app-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"

export const Notifier = () => {
  const notification = useAppSelector(selectNotification)

  const dispatch = useAppDispatch()

  const handleClose = (_: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return
    dispatch(hideNotificationAC())
  }

  if (!notification) return null

  // A fresh portal per message: an open dialog marks its existing siblings aria-hidden,
  // so a node mounted later stays visible to screen readers (and tests)
  return (
    <Portal key={notification.id}>
      <Snackbar
        open
        autoHideDuration={notification.severity === "error" ? 6000 : 3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%", alignItems: "center" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Portal>
  )
}
