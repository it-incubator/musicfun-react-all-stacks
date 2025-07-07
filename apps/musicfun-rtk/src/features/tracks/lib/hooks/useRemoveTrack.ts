import { useRemoveTrackMutation } from '../../api/tracksApi.ts'
import { type MouseEvent, useState } from 'react'
import { showSuccessToast } from '@/common/utils'
import type { Nullable } from '@/common/types'

export const useRemoveTrack = (onSuccess?: () => void) => {
  const [removingTrackId, setRemovingTrackId] = useState<Nullable<string>>(null)

  const [mutate] = useRemoveTrackMutation()

  const removeTrack = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    if (confirm('Вы уверены, что хотите удалить трек?')) {
      setRemovingTrackId(trackId)
      mutate({ trackId })
        .unwrap()
        .then(() => {
          showSuccessToast('Трек удален')
          onSuccess?.()
        })
    }
  }

  return { removeTrack, removingTrackId }
}
