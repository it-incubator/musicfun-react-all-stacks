import { useRemoveTrackMutation } from '../../api/tracksApi.ts'
import { type MouseEvent, useState } from 'react'
import { successToast } from '@/common/utils'
import type { Nullable } from '@/common/types'

export const useRemoveTrack = (onSuccess?: () => void) => {
  const [removingTrackId, setRemovingTrackId] = useState<Nullable<string>>(null)

  const [mutate] = useRemoveTrackMutation()

  const removeTrack = (e: MouseEvent, trackId: string) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this track?')) {
      setRemovingTrackId(trackId)
      mutate({ trackId })
        .unwrap()
        .then(() => {
          successToast('Track deleted')
          onSuccess?.()
        })
    }
  }

  return { removeTrack, removingTrackId }
}
