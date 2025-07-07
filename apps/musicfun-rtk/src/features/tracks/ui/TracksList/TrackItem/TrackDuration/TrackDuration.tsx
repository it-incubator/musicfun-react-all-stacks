import { useEffect, useState } from 'react'

const durationCache = new Map<string, number>()

const getAudioDuration = (url: string): Promise<number> => {
  if (durationCache.has(url)) {
    return Promise.resolve(durationCache.get(url)!)
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio()

    const cleanup = () => {
      audio.removeEventListener('loadedmetadata', onLoad)
      audio.removeEventListener('error', onError)
    }

    const onLoad = () => {
      cleanup()
      const duration = audio.duration
      durationCache.set(url, duration)
      resolve(duration)
    }

    const onError = () => {
      cleanup()
      reject(new Error('Failed to load audio metadata'))
    }

    audio.addEventListener('loadedmetadata', onLoad)
    audio.addEventListener('error', onError)

    audio.preload = 'metadata'
    audio.src = url
  })
}

const formatDuration = (seconds: number | null) => {
  if (!seconds || seconds === 0) return '--:--'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const TrackDuration = ({ url }: { url: string }) => {
  const [duration, setDuration] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!url) return

    setLoading(true)

    getAudioDuration(url)
      .then((duration) => {
        setDuration(duration)
        setLoading(false)
      })
      .catch(() => {
        setDuration(null)
        setLoading(false)
      })
  }, [url])

  if (loading) return <span>--:--</span>
  return <span>{formatDuration(duration)}</span>
}
