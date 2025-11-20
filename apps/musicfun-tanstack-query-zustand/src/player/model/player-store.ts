import { create } from 'zustand'

type CurrentTrack = { id: string; title: string; artist: string; src: string; coverSrc?: string }

export type PlayerStore = {
  currentState: 'playing' | 'paused' | 'stopped'
  duration: number
  currentTime: number
  currentTrack: CurrentTrack | null
  volume: number
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
      const { isMuted, volume } = get()

      if (isMuted) {
        const restoredVolume = volume || 0.5
        audio.muted = false
        audio.volume = restoredVolume
        set({ isMuted: false, volume: restoredVolume })
      } else {
        audio.muted = true
        set({ isMuted: true })
      }
    },
  }
})
