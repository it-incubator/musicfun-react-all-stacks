import { type SubscriberType, SubscribingObject } from "./SubscribingObject"
import { PlayerCore } from "./PlayerCore"

export type PlayerLogicEvents = "ended" | "progress" | "timeupdate" | "pause" | "play" | "change-progress"

export type PlayerLogicTrack = {
  id: string | number
  title: string
  artist: string
  type: string
  format: string
  url: string
  images: {
    original: string
    thumbnail: string
    middle: string
  }
}

export enum PlayStatus {
  Stopped,
  Playing,
  Paused,
}

export class PlayerLogic {
  get isPlaying() {
    return this.status === PlayStatus.Playing
  }

  private trackDataValue: any // data of beat, playing in core
  public currentTrack: PlayerLogicTrack | null = null

  public get trackData() {
    return this.trackDataValue
  }

  public status: PlayStatus = PlayStatus.Stopped

  private eventsObject: SubscribingObject<PlayerLogicEvents> = new SubscribingObject<PlayerLogicEvents>()

  private playlist: PlayerLogicTrack[] = []
  private playerCore: PlayerCore

  playingProgressPercent = 0
  loadingProgressPercent = 0

  constructor(playerCore: PlayerCore) {
    this.playerCore = playerCore
    playerCore.bindEvent("timeupdate", () => {
      this.playingProgressPercent = playerCore.currentPositionInPercent()
      this.eventsObject.triggerEvent("timeupdate", {
        currentPosition: this.playingProgressPercent,
      })
    })

    playerCore.bindEvent("ended", () => {
      this.eventsObject.triggerEvent("ended", {})
    })

    playerCore.bindEvent("progress", () => {
      this.loadingProgressPercent = playerCore.getBufferedPercent()

      this.eventsObject.triggerEvent("progress", {
        currentLoadPosition: this.loadingProgressPercent,
      })
    })
  }

  isMyTrack(id: number | string, type: string) {
    return this.currentTrack?.id === id && this.currentTrack?.type === type
  }

  subscribe(eventName: PlayerLogicEvents, subscriber: SubscriberType) {
    return this.eventsObject.addSubscriber(eventName, subscriber)

    // if (
    //     (eventName === 'play' && this.isPlaying) ||
    //     (eventName === 'pause' && !this.isPlaying && !!this.currentTrack)
    // ) {
    //     subscriber(this.currentTrack)
    // }
  }

  public play<T>(track: PlayerLogicTrack, data: T | null = null) {
    this.status = PlayStatus.Playing
    this.currentTrack = track
    this.trackDataValue = data
    this.playerCore.play({ src: track.url, format: track.format })
    this.eventsObject.triggerEvent("play", { track, data })
  }

  public continuePlayAfterPause() {
    if (!this.currentTrack) {
      console.warn("No track for continue playing")
      return
    }
    this.status = PlayStatus.Playing
    this.playerCore.play({
      src: this.currentTrack.url,
      format: this.currentTrack.format,
    })
    this.eventsObject.triggerEvent("play", {
      track: this.currentTrack,
      data: this.trackData,
    })
  }

  public setTrack<T>(track: PlayerLogicTrack, data: T | null = null) {
    this.status = PlayStatus.Stopped
    this.currentTrack = track
    this.trackDataValue = data
    // trigger play event to notify subscribers for refreshing
    // todo: trigger other event?
    this.eventsObject.triggerEvent("play", { track, data })
  }

  public pause = (): void => {
    this.status = PlayStatus.Stopped
    this.playerCore.pause()
    this.eventsObject.triggerEvent("pause", this.currentTrack)
  }

  public setTrackPositionByPercent(percent: number) {
    this.playerCore.setTrackPositionByPercent(percent)
    this.eventsObject.triggerEvent("timeupdate", { percent })
  }

  private getTrackPosition() {
    const percent = this.playerCore.currentPositionInPercent()
    this.eventsObject.triggerEvent("change-progress", { percent })
  }

  public setPlayList(tracks: Array<any>) {
    this.playlist = tracks
  }

  public playNext() {
    // no current - no next
    if (!this.currentTrack) {
      return
    }

    for (let i = 0; i < this.playlist.length; i++) {
      if (this.playlist[i].id === this.currentTrack.id) {
        if (i + 1 <= this.playlist.length - 1) {
          this.play(this.playlist[i + 1])
          break
        }
      }
    }
  }

  public playPrev() {
    // no current - no prev
    if (!this.currentTrack) {
      return
    }

    for (let i = 0; i < this.playlist.length; i++) {
      if (this.playlist[i] === this.currentTrack) {
        if (i - 1 >= 0) {
          this.play(this.playlist[i - 1])
        }
        break
      }
    }
  }

  changeVolume(volume: number) {
    this.playerCore.setVolume(volume)
  }
}
