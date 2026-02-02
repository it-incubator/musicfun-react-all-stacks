import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

import type { RepeatMode } from '@/player'
import noCoverPlaceholder from '@/shared/assets/images/no-cover-placeholder.avif'
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
import { IconOneRepeat } from '@/shared/icons/IconOneRepeat.tsx'

import { IconButton } from '../IconButton'
import { Typography } from '../Typography'
import s from './AudioPlayer.module.css'

export type PlayerProps = {
  cover: string
  title: string
  artist: string
  isPlaying: boolean
  onNext: () => void
  onPrevious: () => void
  onTogglePlay: () => void
  isShuffle: boolean
  isRepeat: RepeatMode
  onShuffle: () => void
  onRepeat: () => void
  duration: number
  currentTime: number
  volume: number
  onTimeSeek: (time: number) => void
  onVolumeSet: (volume: number) => void
} & ComponentProps<'div'>

export const AudioPlayer = ({
  cover = noCoverPlaceholder,
  title,
  artist,
  isPlaying,
  onNext,
  onPrevious,
  onTogglePlay,
  isShuffle,
  isRepeat,
  onShuffle,
  onRepeat,
  className,
  duration,
  currentTime,
  volume,
  onTimeSeek,
  onVolumeSet,
  ...props
}: PlayerProps) => {
  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeSeek(Number(e.target.value))
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeSet(Number(e.target.value))
  }

  const handleVolumeMute = () => {
    onVolumeSet(volume > 0 ? 0 : 1)
  }

  return (
    <div className={clsx(s.player, className)} {...props}>
      <div className={s.trackInfo}>
        <div className={s.cover}>
          <img src={cover} alt="cover" />
        </div>
        <div className={s.info}>
          <Typography variant="body1" as="h3">
            {title}
          </Typography>
          <Typography variant="body2" as="p">
            {artist}
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
          <IconButton className={s.playPauseButton} onClick={onTogglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <IconButton onClick={onNext}>
            <SkipNextIcon />
          </IconButton>
          <IconButton
            onClick={onRepeat}
            className={clsx(s.iconButton, isRepeat !== 'off' && s.active)}>
            {isRepeat === 'one' ? <IconOneRepeat /> : <RepeatIcon />}
          </IconButton>
        </div>

        <div className={s.progressBar}>
          <span className={s.time}>{format(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleChangeTime}
            className={clsx(s.progress, s.trackProgress)}
          />
          <span className={s.time}>{format(duration)}</span>
        </div>
      </div>

      <div className={s.volumeColumn}>
        <IconButton onClick={handleVolumeMute}>
          {volume > 0 ? <VolumeIcon /> : <VolumeMuteIcon />}
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

const format = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
