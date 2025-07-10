import { useAudioDuration } from '@/features/tracks/lib/hooks/useAudioDuration.ts'
import { formatDuration } from '@/common/utils'

type TrackDurationProps = {
  url: string
  loadingText?: string
  errorText?: string
}

export const TrackDuration = ({ url, loadingText = '--:--', errorText = '--:--' }: TrackDurationProps) => {
  const { duration, loading, error } = useAudioDuration(url)

  if (loading && duration === null) {
    return <span>{loadingText}</span>
  }

  if (error) {
    return <span title={error}>{errorText}</span>
  }

  return <span>{formatDuration(duration)}</span>
}
