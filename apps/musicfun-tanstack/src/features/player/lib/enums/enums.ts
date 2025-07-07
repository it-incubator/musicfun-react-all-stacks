export const PlayStatus = {
  Stopped: 0,
  Playing: 1,
  Paused: 2,
} as const

export type PlayStatus = (typeof PlayStatus)[keyof typeof PlayStatus]
