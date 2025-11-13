import { create } from 'zustand'

type CurrentTrack = { id: string; title: string; artist: string; src: string; coverSrc?: string }

export type PlayerStore = {
  currentState: 'playing' | 'paused' | 'stopped'
  duration: number
  currentTime: number
  currentTrack: CurrentTrack | null
  volume: number
  prevVolume: number | null
  isMuted: boolean
  play: (track: CurrentTrack) => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
}

const audio = new Audio()

export const usePlayerStore = create<PlayerStore>((set, get) => {
  audio.addEventListener('loadedmetadata', () => {
    set({ duration: audio.duration })
  })

  audio.addEventListener('timeupdate', () => {
    set({ currentTime: audio.currentTime })
  })

  return {
    currentState: 'stopped',
    duration: 0,
    currentTime: 0,
    currentTrack: null,
    volume: 1,
    prevVolume: null,
    isMuted: false,

    play(track) {
      const prevTrack = get().currentTrack
      if (prevTrack?.id !== track.id) {
        audio.src = track.src
        set({ currentTrack: track })
      }
      audio.play()

      set({ currentState: 'playing' })
    },
    pause() {
      audio.pause()
      set({ currentState: 'paused' })
    },
    seek(time) {
      audio.currentTime = time
    },
    setVolume(volume) {
      audio.volume = volume
      set({ volume, isMuted: volume === 0 })
    },
    toggleMute() {
      const { isMuted, volume, prevVolume } = get()

      if (isMuted) {
        const restoredVolume = prevVolume ?? 1
        audio.muted = false
        audio.volume = restoredVolume
        set({ isMuted: false, volume: restoredVolume, prevVolume: null })
      } else {
        audio.muted = true
        set({ isMuted: true, prevVolume: volume, volume: 0 })
      }
    },
  }
})
