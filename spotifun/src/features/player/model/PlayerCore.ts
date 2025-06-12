import Hls, { type HlsConfig } from "hls.js"

export type PlayerCoreTrackType = {
  src: string
  format: string // 'm3u8' | 'mp3'
}

export interface IPlayer {
  checkFormat: (format: string) => boolean
  play: (src: string) => void
}

export class PlayerCore {
  private video: HTMLVideoElement
  private currentSrc = ""
  protected allowRewindToNotLoadedPosition = true

  constructor() {
    this.video = document.getElementById("global-player") as HTMLVideoElement
    this.video.volume = 1
    this.video.autoplay = false
    this.video.crossOrigin = "anonymous"
  }

  currentPositionInPercent() {
    return 100 * (this.video.currentTime / this.video.duration)
  }

  // if parameter 'src' passed then load new beat and start play
  play(track: PlayerCoreTrackType) {
    // continue playing current track
    if (track.src === this.currentSrc) {
      this.video.play()
      return
    }

    if (track.format === "mp3") {
      this.setSrc(track.src)
      this.video.play()
      return
    } else if (track.format === "m3u8") {
      if (Hls.isSupported()) {
        const config: Partial<HlsConfig> = {
          // debug: true,
          xhrSetup: (xhr) => {
            // xhr.withCredentials = true; // do send cookie
            xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With")
            xhr.setRequestHeader("Access-Control-Allow-Origin", document.location.origin)
            // xhr.setRequestHeader("Access-Control-Allow-Credentials","true");
          },
        }
        this.currentSrc = track.src

        const hls = new Hls(config)
        hls.loadSource(track.src)
        hls.attachMedia(this.video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.video.play()
        })
      }
      // hls.js is not supported on platforms that do not have Media Source
      // Extensions (MSE) enabled.
      //
      // When the browser has built-in HLS support (check using `canPlayType`),
      // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
      // element through the `src` property. This is using the built-in support
      // of the plain video element, without using hls.js.
      //
      // Note: it would be more normal to wait on the 'canplay' event below however
      // on Safari (where you are most likely to find built-in HLS support) the
      // video.src URL must be on the user-driven white-list before a 'canplay'
      // event will be emitted; the last video event that can be reliably
      // listened-for when the URL is not on the white-list is 'loadedmetadata'.
      else if (this.video.canPlayType("application/vnd.apple.mpegurl")) {
        this.currentSrc = track.src
        this.setSrc(track.src)
        this.video.addEventListener("loadedmetadata", () => {
          this.video.play()
        })
      }
    } else {
      console.warn(`format ${track.format} is not supported`)
    }
  }

  setSrc(src: string) {
    this.currentSrc = src
    this.video.src = src
  }

  // activates 'pause' mode. Call play method to start
  pause() {
    this.video.pause()
  }

  // rewind beat to start position
  setPositionToStart() {
    this.video.currentTime = 0
  }

  // returns true if at least one byte are downloaded from the server (buffered in a Audio)
  // todo: should be private
  private areAtLeastAnyBytesOfTrackBuffered() {
    return this.video.buffered.length > 0
  }

  // rewind beat to start position
  getBufferedPercent() {
    if (!this.areAtLeastAnyBytesOfTrackBuffered()) {
      return 0
    }

    const bufferedSeconds = this.video.buffered.end(this.video.buffered.length - 1)
    const bufferedSecondsPercent = 100 * (bufferedSeconds / this.video.duration)
    return bufferedSecondsPercent
  }

  // rewind beat to neccessary position in percent (for example, play beat from 45%)
  // parameter: percent from which playing will start
  setTrackPositionByPercent(percent: number) {
    this.video.currentTime = this.getTimePositionByPercentPosition(percent)
  }

  // activates 'pause' mode. Call play method to start
  bindEvent(eventName: string, callback: any) {
    this.video.addEventListener(eventName, callback, false)
    return () => {
      this.video.removeEventListener(eventName, callback)
    }
  }

  // get time position by persent position
  private getTimePositionByPercentPosition(percent: any) {
    if (this.video.buffered.length === 0) {
      return 0
    }
    const bufferedSeconds = this.video.buffered.end(this.video.buffered.length - 1)
    const bufferedSecondsPercent = 100 * (bufferedSeconds / this.video.duration)

    if (!this.allowRewindToNotLoadedPosition) {
      if (percent > bufferedSecondsPercent) {
        percent = bufferedSecondsPercent
      }
    }

    return (this.video.duration * percent) / 100
  }

  setVolume(volume: any) {
    this.video.volume = volume
  }
}
