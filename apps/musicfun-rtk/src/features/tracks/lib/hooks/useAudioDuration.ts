import { useEffect, useState } from 'react'
import { getAudioDuration, hasCachedDuration } from '@/common/utils'
import type { Nullable } from '@/common/types'

type UseAudioDurationResult = {
  duration: Nullable<number>
  loading: boolean
  error: Nullable<string>
}

export const useAudioDuration = (url: string): UseAudioDurationResult => {
  const [duration, setDuration] = useState<Nullable<number>>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Nullable<string>>(null)

  useEffect(() => {
    if (!url) {
      setDuration(null)
      setLoading(false)
      setError(null)
      return
    }

    let isMounted = true

    setError(null)

    if (!hasCachedDuration(url)) {
      setLoading(true)
    }

    getAudioDuration(url)
      .then((result) => {
        if (!isMounted) return

        if (!isNaN(result)) {
          setDuration(result)
          setError(null)
        } else {
          setDuration(null)
          setError('Failed to retrieve audio duration')
        }

        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return

        setDuration(null)
        setLoading(false)
        setError(err.message || 'Unknown error occurred')
      })

    return () => {
      isMounted = false
    }
  }, [url])

  return {
    duration,
    loading,
    error,
  }
}
