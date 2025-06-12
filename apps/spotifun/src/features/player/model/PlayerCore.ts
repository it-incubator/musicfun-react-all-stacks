export type PlayerCoreTrackType = {
  src: string
  format: string // 'm3u8' | 'mp3'
}

export interface IPlayer {
  checkFormat: (format: string) => boolean
  play: (src: string) => void
}

export class PlayerCore {
  private audio: Audio
  private currentSrc = ""
  protected allowRewindToNotLoadedPosition = true

  constructor() {
    this.audio = new Audio()
    this.audio.volume = 1
    this.audio.autoplay = false
  }

  currentPositionInPercent() {
    return 100 * (this.audio.currentTime / this.audio.duration)
  }

  // if parameter 'src' passed then load new beat and start play
  play(track: PlayerCoreTrackType) {
    // continue playing current track
    if (track.src === this.currentSrc) {
      this.audio.play()
      return
    }

    this.setSrc(track.src)
    this.audio.play()
    return
  }

  setSrc(src: string) {
    this.currentSrc = src
    this.audio.src = src
  }

  // activates 'pause' mode. Call play method to start
  pause() {
    this.audio.pause()
  }

  // rewind beat to start position
  setPositionToStart() {
    this.audio.currentTime = 0
  }

  // returns true if at least one byte are downloaded from the server (buffered in a Audio)
  // todo: should be private
  private areAtLeastAnyBytesOfTrackBuffered() {
    return this.audio.buffered.length > 0
  }

  // rewind beat to start position
  getBufferedPercent() {
    if (!this.areAtLeastAnyBytesOfTrackBuffered()) {
      return 0
    }

    const bufferedSeconds = this.audio.buffered.end(this.audio.buffered.length - 1)
    const bufferedSecondsPercent = 100 * (bufferedSeconds / this.audio.duration)
    return bufferedSecondsPercent
  }

  // rewind beat to neccessary position in percent (for example, play beat from 45%)
  // parameter: percent from which playing will start
  setTrackPositionByPercent(percent: number) {
    this.audio.currentTime = this.getTimePositionByPercentPosition(percent)
  }

  // activates 'pause' mode. Call play method to start
  bindEvent(eventName: string, callback: any) {
    this.audio.addEventListener(eventName, callback, false)
    return () => {
      this.audio.removeEventListener(eventName, callback)
    }
  }

  // get time position by persent position
  private getTimePositionByPercentPosition(percent: any) {
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

  setVolume(volume: any) {
    this.audio.volume = volume
  }
}
