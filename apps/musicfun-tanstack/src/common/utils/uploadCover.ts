import { showErrorToast } from './showErrorToast.ts'
import type { ChangeEvent } from 'react'

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
    showErrorToast('Разрешены только изображения JPEG, PNG или GIF')
    return
  }

  if (file.size > maxSize) {
    showErrorToast(`Файл слишком большой (макс. ${Math.round(maxSize / 1024)} КБ)`)
    return
  }

  onSuccess(file)
}
