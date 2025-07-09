import type { Nullable } from '@/common/types'

const durationCache = new Map<string, number>()

export const getAudioDuration = (url: string): Promise<number> => {
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

export const formatDuration = (seconds: Nullable<number>): string => {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) {
    return '--:--'
  }
  const safeSeconds = Math.ceil(seconds)

  const mins = Math.floor(safeSeconds / 60)
  const secs = Math.floor(safeSeconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const clearDurationCache = (): void => {
  durationCache.clear()
}

export const hasCachedDuration = (url: string): boolean => {
  return durationCache.has(url)
}
