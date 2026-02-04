import { clsx } from 'clsx'
import * as React from 'react'

import {
  useCurrentTrack,
  usePlaybackProgress,
  usePlaybackState,
  usePlayerControls,
  useVolumeControl,
} from '@/player'
import { CoverImage } from '@/shared/components'
import { useThrottleCallback } from '@/shared/hooks'
import {
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipNextIcon,
  SkipPreviousIcon,
  VolumeIcon,
  VolumeMuteIcon,
} from '@/shared/icons'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'
import s from './AudioPlayer.module.css'

export type PlayerProps = {
  onNext: () => void
  onPrevious: () => void
  isShuffle: boolean
  isRepeat: boolean
  onShuffle: () => void
  onRepeat: () => void
} & React.ComponentProps<'div'>

const durationSliderCoefficients = 10

export const AudioPlayer = ({
  onNext,
  onPrevious,
  isShuffle,
  isRepeat,
  onShuffle,
  onRepeat,
  className,
  ...props
}: PlayerProps) => {
  const { track: currentTrack } = useCurrentTrack()
  const { isPlaying } = usePlaybackState()
  const { currentTime, duration, formattedTime } = usePlaybackProgress()
  const { volume, isMuted } = useVolumeControl()
  const { play, pause, seek, setVolume, toggleMute } = usePlayerControls()

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      if (currentTrack) play(currentTrack)
    }
  }

  const setThrottledTime = useThrottleCallback((time) => {
    seek(time)
  }, 15)

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value) / durationSliderCoefficients
    setThrottledTime(time)
  }

  const setThrottledVolume = useThrottleCallback((newVolume) => {
    setVolume(newVolume)
  }, 15)

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setThrottledVolume(newVolume)
  }

  const handleVolumeMute = () => {
    toggleMute()
  }

  if (!currentTrack) {
    return null
  }

  return (
    <div className={clsx(s.player, className)} {...props}>
      <div className={s.trackInfo}>
        <div className={s.cover}>
          <CoverImage imageSrc={currentTrack.albumArt} imageDescription={'cover'} />
        </div>
        <div className={s.info}>
          <Typography variant="body1" as="h3">
            {currentTrack.title}
          </Typography>
          <Typography variant="body2" as="p">
            {currentTrack.artist}
          </Typography>
        </div>
      </div>

      <div className={s.playerControls}>
        <div className={s.controls}>
          <IconButton onClick={onShuffle} className={clsx(s.iconButton, isShuffle && s.active)}>
            <ShuffleIcon />
          </IconButton>
          <IconButton onClick={onPrevious}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton className={s.playPauseButton} onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <IconButton onClick={onNext}>
            <SkipNextIcon />
          </IconButton>
          <IconButton onClick={onRepeat} className={clsx(s.iconButton, isRepeat && s.active)}>
            <RepeatIcon />
          </IconButton>
        </div>

        <div className={s.progressBar}>
          <span className={s.time}>{formattedTime.current}</span>
          <input
            type="range"
            min={0}
            max={duration * durationSliderCoefficients}
            value={currentTime * durationSliderCoefficients}
            onChange={handleChangeTime}
            className={clsx(s.progress, s.trackProgress)}
          />
          <span className={s.time}>{formattedTime.duration}</span>
        </div>
      </div>

      <div className={s.volumeColumn}>
        <IconButton onClick={handleVolumeMute}>
          {isMuted || volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
        </IconButton>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolume}
          className={clsx(s.progress, s.volumeProgress)}
        />
      </div>
    </div>
  )
}
