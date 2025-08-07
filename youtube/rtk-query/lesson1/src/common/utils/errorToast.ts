import { toast } from 'react-toastify'

export const errorToast = (message: string, error?: unknown) => {
  toast(message, { theme: 'colored', type: 'error' })

  if (error) {
    console.error(`${message}\n`, error)
  }
}
