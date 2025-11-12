import type { Nullable } from '@/common/types'
import type { BaseAttributes, TrackDetails } from '../../tracks/api/tracksApi.types.ts'
import { PlayStatus } from '../lib/enums/enums.ts'
import { PlayerCore } from './PlayerCore'
import { type SubscriberType, SubscribingObject } from './SubscribingObject'

export type PlayerLogicEvents = 'ended' | 'progress' | 'timeupdate' | 'pause' | 'play' | 'change-progress'

export type PlayerLogicTrack<T extends BaseAttributes> = TrackDetails<T>

export class PlayerLogic {
  get isPlaying() {
    return this.status === PlayStatus.Playing
  }

  private trackDataValue: any
  public currentTrack: Nullable<PlayerLogicTrack<BaseAttributes>> = null

  public get trackData() {
    return this.trackDataValue
  }

  public status: PlayStatus = PlayStatus.Stopped

  private eventsObject: SubscribingObject<PlayerLogicEvents> = new SubscribingObject<PlayerLogicEvents>()

  private playlist: PlayerLogicTrack<BaseAttributes>[] = []
  private playerCore: PlayerCore

  playingProgressPercent = 0
  loadingProgressPercent = 0

  constructor(playerCore: PlayerCore) {
    this.playerCore = playerCore
    playerCore.bindEvent('timeupdate', () => {
      this.playingProgressPercent = playerCore.currentPositionInPercent()
      this.eventsObject.triggerEvent('timeupdate', {
        currentPosition: this.playingProgressPercent,
      })
    })

    playerCore.bindEvent('ended', () => {
      this.eventsObject.triggerEvent('ended', {})
    })

    playerCore.bindEvent('progress', () => {
      this.loadingProgressPercent = playerCore.getBufferedPercent()

      this.eventsObject.triggerEvent('progress', {
        currentLoadPosition: this.loadingProgressPercent,
      })
    })
  }

  isMyTrack(id: string, type: string) {
    return this.currentTrack?.id === id && this.currentTrack?.type === type
  }

  subscribe(eventName: PlayerLogicEvents, subscriber: SubscriberType) {
    return this.eventsObject.addSubscriber(eventName, subscriber)
  }

  public play<T extends BaseAttributes>(track: TrackDetails<T>, data: Nullable<T> = null) {
    this.status = PlayStatus.Playing
    this.currentTrack = track
    this.trackDataValue = data
    this.playerCore.play(track.attributes.attachments[0].url)
    this.eventsObject.triggerEvent('play', { track, data })
  }

  public continuePlayAfterPause() {
    if (!this.currentTrack) {
      console.log('No track for continue playing')
      return
    }
    this.status = PlayStatus.Playing
    this.playerCore.play(this.currentTrack.attributes.attachments[0].url)
    this.eventsObject.triggerEvent('play', { track: this.currentTrack, data: this.trackData })
  }

  public setTrack<T extends BaseAttributes>(track: TrackDetails<T>, data: T | null = null) {
    this.status = PlayStatus.Stopped
    this.currentTrack = track
    this.trackDataValue = data
    // trigger play event to notify subscribers for refreshing
    // todo: trigger other event?
    this.eventsObject.triggerEvent('play', { track, data })
  }

  public pause = (): void => {
    this.status = PlayStatus.Stopped
    this.playerCore.pause()
    this.eventsObject.triggerEvent('pause', this.currentTrack)
  }

  public setTrackPositionByPercent(percent: number) {
    this.playerCore.setTrackPositionByPercent(percent)
    this.eventsObject.triggerEvent('timeupdate', { percent })
  }

  private getTrackPosition() {
    const percent = this.playerCore.currentPositionInPercent()
    this.eventsObject.triggerEvent('change-progress', { percent })
  }

  public setPlayList<T extends BaseAttributes>(tracks: TrackDetails<T>[]) {
    this.playlist = tracks
  }

  public playNext() {
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
