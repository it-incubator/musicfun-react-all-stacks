import type { components } from '@/common/api/schema.ts'

export type Images = {
  main: Cover[]
}

export type Image2 = components['schemas']['GetImagesOutput']

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
