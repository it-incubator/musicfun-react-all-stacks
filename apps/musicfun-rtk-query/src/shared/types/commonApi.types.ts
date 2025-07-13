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
  type: 'original' | 'medium' | 'thumbnail'
  width: number
  height: number
  fileSize: number
  url: string
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
