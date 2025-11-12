import { clsx } from 'clsx'
import { type ComponentProps, useRef, useState } from 'react'

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
  src: string
  cover: string
  title: string
  artist: string
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  onNext: () => void
  onPrevious: () => void
  isShuffle: boolean
  isRepeat: boolean
  onShuffle: () => void
  onRepeat: () => void
} & ComponentProps<'div'>

export const AudioPlayer = ({
  src,
  cover,
  title,
  artist,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrevious,
  isShuffle,
  isRepeat,
  onShuffle,
  onRepeat,
  className,
  ...props
}: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [duration, setDuration] = useState(0)

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((e) => {
        console.error('Audio play error:', e)
      })
    }

    setIsPlaying(!isPlaying)
  }

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleVolumeMute = () => {
    const newVolume = volume > 0 ? 0 : 1
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className={clsx(s.player, className)} {...props}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

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
