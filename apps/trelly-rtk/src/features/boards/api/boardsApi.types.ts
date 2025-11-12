import type { Meta } from "@/common/types"
import { z } from "zod"

export type FilterValues = "all" | "active" | "completed"

export type BoardsResponse = {
  data: Board[]
  meta: Meta
}

export type Board = {
  id: string
  type: "boards"
  attributes: BoardAttributes
}

export type DomainBoard = { filter: FilterValues } & Board

export type DomainBoardResponse = {
  data: DomainBoard[]
  meta: Meta
}

export type BoardAttributes = {
  title: string
  description: string
  addedAt: string
  images: Images
  isImportant: boolean
  order: number
  updatedAt: string
}

// TODO: проверить реально ли такой тип возвращает бекенд
export type Images = {
  main: Cover[]
}

export type Cover = {
  type: "original" | "medium" | "thumbnail"
  width: number
  height: number
  fileSize: number
  url: string
}

// Arguments
export type UpdateBoardArgs = {
  id: string
  title: string
  description: string
  isImportant: boolean
}

// 👴 old with zod
export const TodolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.string(),
  order: z.number(),
})

export type Todolist = z.infer<typeof TodolistSchema>
