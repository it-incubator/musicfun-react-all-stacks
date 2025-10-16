import { CurrentUserReaction } from '@/common/enums'
import * as z from 'zod'

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const coverSchema = z.object({
  type: z.literal(['original', 'medium', 'thumbnail']),
  width: z.int().positive(),
  height: z.int().positive(),
  fileSize: z.int().positive(),
  url: z.url(),
})

export const imagesSchema = z.object({
  main: z.array(coverSchema),
})

export const currentUserReactionSchema = z.enum(CurrentUserReaction)
