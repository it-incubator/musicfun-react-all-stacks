import { useSelector } from 'react-redux'

import { selectCurrentTime, selectDuration } from '@/player'

export const usePlayingTrackProgress = () => {
  const currentTime = useSelector(selectCurrentTime)
  const duration = useSelector(selectDuration)
  const playingTrackProgress = duration > 0 ? (currentTime / duration) * 100 : 0
  return { playingTrackProgress }
}
