export type ExtensionsError = {
  data: {
    extensions?: { key?: string; message?: string }[]
  }
}

export type Images = {
  main: Cover[]
}

export type Meta = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
}

export type Cover = {
  type: ImageType
  width: number
  height: number
  fileSize: number
  url: string
}

export enum ImageType {
  ORIGINAL = 'original',
  MEDIUM = 'medium',
  THUMBNAIL = 'thumbnail',
}

export enum CurrentUserReaction {
  None = 0,
  Like = 1,
  Dislike = -1,
}

export type User = {
  id: string
  name: string
}

export type ReactionResponse = {
  objectId: string
  value: number
  likes: number
  dislikes: number
}
