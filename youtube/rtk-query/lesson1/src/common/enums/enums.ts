export const CurrentUserReaction = {
  Like: 1,
  Dislike: -1,
  None: 0,
} as const

export type CurrentUserReaction = (typeof CurrentUserReaction)[keyof typeof CurrentUserReaction]
