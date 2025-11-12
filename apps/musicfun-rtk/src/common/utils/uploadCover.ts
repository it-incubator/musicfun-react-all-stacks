import type { ChangeEvent } from 'react'
import { errorToast } from './errorToast'

type Props = {
  maxSize: number
  onSuccess: (file: File) => void
  event: ChangeEvent<HTMLInputElement>
  allowedTypes?: string[]
}

const defaultTypes = ['image/jpeg', 'image/png', 'image/gif']

export const uploadCover = ({ maxSize, onSuccess, event, allowedTypes = defaultTypes }: Props) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!allowedTypes.includes(file.type)) {
    errorToast('Only JPEG, PNG or GIF images are allowed')
    return
  }

  if (file.size > maxSize) {
    errorToast(`File too large (max ${Math.round(maxSize / 1024)} KB)`)
    return
  }

  onSuccess(file)
}
