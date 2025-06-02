import type { Nullable } from "@/common/types"

export type Tag = {
  id: string
  userId: string
  normalizedName: string
  originalName: string
  addedAt: string
  deletedAt: Nullable<string>
  updatedAt: string
  version: number
}
