import type { Nullable } from '@/common/types'
import type { TrackOutput } from '@/modules/musicstaff/tracks/api/tracksApi.types.ts'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { PlayerLogic } from '../../model/PlayerLogic.ts'
import { PlayerContext } from '../context/PlayerContext.ts'

export const usePlayer = (needProgress: boolean, track: Nullable<TrackOutput>) => {
  const player = useContext(PlayerContext) as PlayerLogic

  const unsubscribersRef = useRef<Array<() => void>>([])

  const [, setCounter] = useState(0)
  const [isPlayingMe, setIsPlayingMe] = useState(false)

  const playStatusChanged = useCallback(() => {
    if (track) {
      const isMyTrack = player.isMyTrack(track.id, track.type)
      const actualIsPlayingMe = isMyTrack && player.isPlaying
      if (actualIsPlayingMe !== isPlayingMe) {
        setIsPlayingMe(actualIsPlayingMe)
      }
    } else {
      setIsPlayingMe(player.isPlaying)
    }
  }, [isPlayingMe, track, player])

  const refresh = () => {
    setCounter((s) => s + 1)
  }

  useEffect(() => {
    if (needProgress) {
      unsubscribersRef.current.push(player.subscribe('change-progress', refresh))
      unsubscribersRef.current.push(player.subscribe('timeupdate', refresh))
      unsubscribersRef.current.push(player.subscribe('progress', refresh))
    }
    unsubscribersRef.current.push(player.subscribe('play', playStatusChanged))
    unsubscribersRef.current.push(player.subscribe('pause', playStatusChanged))
    unsubscribersRef.current.push(player.subscribe('ended', playStatusChanged))

    return () => {
      unsubscribersRef.current.forEach((unsubscriber) => unsubscriber())
      unsubscribersRef.current = []
    }
  }, [playStatusChanged, needProgress, player])

  return [player, isPlayingMe] as [PlayerLogic, boolean]
}
