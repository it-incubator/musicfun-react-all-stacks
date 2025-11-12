import { toast } from 'react-toastify'

export const showSuccessToast = (message: string) => {
  toast(message, { theme: 'colored', type: 'success' })
}
