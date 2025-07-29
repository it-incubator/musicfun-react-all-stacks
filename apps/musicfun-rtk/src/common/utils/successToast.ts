import { toast } from 'react-toastify'

export const successToast = (message: string) => {
  toast(message, { theme: 'colored', type: 'success' })
}
