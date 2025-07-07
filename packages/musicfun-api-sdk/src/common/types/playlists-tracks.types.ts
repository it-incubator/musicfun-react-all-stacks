export type Images = {
  main: Cover[]
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
