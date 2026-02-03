import type { Track } from '../types/player.types'

type AudioEventMap = {
  timeupdate: number
  loadedmetadata: { duration: number }
  ended: void
  error: string
  playing: void
  paused: void
  waiting: void
  canplay: void
}

type EventCallback<K extends keyof AudioEventMap> = (data: AudioEventMap[K]) => void

class AudioManager {
  private static instance: AudioManager
  private audio: HTMLAudioElement
  private listeners: Map<keyof AudioEventMap, Set<EventCallback<any>>> = new Map()
  private lastTimeUpdate = 0

  private constructor() {
    this.audio = new Audio()
    this.audio.preload = 'metadata'
    this.audio.crossOrigin = 'anonymous'

    this.bindEvents()
  }

  static get(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  private bindEvents() {
    this.audio.addEventListener('timeupdate', () => {
      const currentTime = this.audio.currentTime
      // Throttle timeupdate events to avoid excessive state updates
      if (Math.abs(currentTime - this.lastTimeUpdate) > 0.5) {
        this.lastTimeUpdate = currentTime
        this.emit('timeupdate', currentTime)
      }
    })

    this.audio.addEventListener('loadedmetadata', () => {
      this.emit('loadedmetadata', { duration: this.audio.duration })
    })

    this.audio.addEventListener('ended', () => {
      this.emit('ended', undefined)
    })

    this.audio.addEventListener('error', () => {
      const errorMessage = this.audio.error?.message || 'Unknown error'
      this.emit('error', errorMessage)
    })

    this.audio.addEventListener('play', () => {
      this.emit('playing', undefined)
    })

    this.audio.addEventListener('pause', () => {
      this.emit('paused', undefined)
    })

    this.audio.addEventListener('waiting', () => {
      this.emit('waiting', undefined)
    })

    this.audio.addEventListener('canplay', () => {
      this.emit('canplay', undefined)
    })
  }

  on<K extends keyof AudioEventMap>(event: K, callback: EventCallback<K>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off<K extends keyof AudioEventMap>(event: K, callback: EventCallback<K>) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
    }
  }

  private emit<K extends keyof AudioEventMap>(event: K, data: AudioEventMap[K]) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }

  async loadTrack(track: Track): Promise<void> {
    if (this.audio.src !== track.url) {
      this.audio.src = track.url

      // Return immediately if already loaded
      if (this.audio.readyState >= 2) {
        return Promise.resolve()
      }

      return new Promise<void>((resolve, reject) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        const onCanPlay = () => {
          if (timeoutId) clearTimeout(timeoutId)
          this.off('canplay', onCanPlay as EventCallback<'canplay'>)
          this.off('error', onError)
          resolve()
        }

        const onError = (_error: string) => {
          if (timeoutId) clearTimeout(timeoutId)
          this.off('canplay', onCanPlay as EventCallback<'canplay'>)
          this.off('error', onError)
          reject(new Error(`Failed to load track: ${track.url}`))
        }

        this.on('canplay', onCanPlay as EventCallback<'canplay'>)
        this.on('error', onError as EventCallback<'error'>)

        // Set a timeout to avoid hanging
        timeoutId = setTimeout(() => {
          this.off('canplay', onCanPlay as EventCallback<'canplay'>)
          this.off('error', onError)
          reject(new Error('Track load timeout'))
        }, 30000)
      })
    }
  }

  play(): Promise<void> {
    return this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  stop() {
    this.audio.pause()
    this.audio.currentTime = 0
  }

  seek(time: number) {
    if (time >= 0 && time <= this.audio.duration) {
      this.audio.currentTime = time
    }
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume))
  }

  setMuted(muted: boolean) {
    this.audio.muted = muted
  }

  getCurrentTime(): number {
    return this.audio.currentTime
  }

  getDuration(): number {
    return this.audio.duration
  }

  getPaused(): boolean {
    return this.audio.paused
  }

  getSrc(): string {
    return this.audio.src
  }

  destroy() {
    this.listeners.clear()
    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
  }
}

export const audioManager = AudioManager.get()
