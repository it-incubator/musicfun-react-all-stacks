import type { PlayerLogicEvents } from './PlayerLogic.ts'

export class PlayerCore {
  private audio: HTMLAudioElement
  private currentSrc = ''
  protected allowRewindToNotLoadedPosition = true

  constructor() {
    this.audio = new Audio()
    this.audio.volume = 1
    this.audio.autoplay = false
  }

  currentPositionInPercent() {
    return 100 * (this.audio.currentTime / this.audio.duration)
  }

  play(src: string) {
    if (src === this.currentSrc) {
      this.audio.play()
      return
    }

    this.setSrc(src)
    this.audio.play()
  }

  setSrc(src: string) {
    this.currentSrc = src
    this.audio.src = src
  }

  pause() {
    this.audio.pause()
  }

  // Rewind track to start position
  setPositionToStart() {
    this.audio.currentTime = 0
  }

  // Returns true if at least one byte is downloaded from server (buffered in Audio)
  // TODO: Should be private
  private areAtLeastAnyBytesOfTrackBuffered() {
    return this.audio.buffered.length > 0
  }

  // Rewind track to start position
  getBufferedPercent() {
    if (!this.areAtLeastAnyBytesOfTrackBuffered()) {
      return 0
    }

    const bufferedSeconds = this.audio.buffered.end(this.audio.buffered.length - 1)
    const bufferedSecondsPercent = 100 * (bufferedSeconds / this.audio.duration)
    return bufferedSecondsPercent
  }

  // Rewind track to necessary position in percent (for example, play track from 45%)
  // Parameter: percent from which playing will start
  setTrackPositionByPercent(percent: number) {
    this.audio.currentTime = this.getTimePositionByPercentPosition(percent)
  }

  // Activate pause mode (call play method to start)
  bindEvent(eventName: PlayerLogicEvents, callback: (event: Event) => void) {
    this.audio.addEventListener(eventName, callback, false)
    return () => {
      this.audio.removeEventListener(eventName, callback)
    }
  }

  private getTimePositionByPercentPosition(percent: number) {
    if (this.audio.buffered.length === 0) {
      return 0
    }
    const bufferedSeconds = this.audio.buffered.end(this.audio.buffered.length - 1)
    const bufferedSecondsPercent = 100 * (bufferedSeconds / this.audio.duration)

    if (!this.allowRewindToNotLoadedPosition) {
      if (percent > bufferedSecondsPercent) {
        percent = bufferedSecondsPercent
      }
    }

    return (this.audio.duration * percent) / 100
  }

  setVolume(volume: number) {
    this.audio.volume = volume
  }
}
