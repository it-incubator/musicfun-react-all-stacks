import type { ImageVariant, JsonApiMeta, JsonApiPayload, PaginationArgs } from "@/common/types"

export type BoardImages = {
  main: ImageVariant[]
}

export type BoardAttributes = {
  title: string
  description: string | null
  addedAt: string
  updatedAt: string
  order: number
  isImportant: boolean
  images: BoardImages
}

export type Board = {
  id: string
  type: "boards"
  attributes: BoardAttributes
}

// Response
export type GetMyBoardsResponse = {
  data: Board[]
}

export type GetBoardsResponse = {
  data: Board[]
  meta: JsonApiMeta
}

export type BoardResponse = {
  data: Board
}

// Arguments
export type GetBoardsArgs = PaginationArgs

export type CreateBoardAttributes = {
  title: string
  description?: string | null
}

export type ReplaceBoardAttributes = {
  title: string
  description: string | null
  isImportant: boolean
}

export type PatchBoardAttributes = Partial<ReplaceBoardAttributes>

export type ReplaceBoardArgs = { boardId: string } & ReplaceBoardAttributes
export type PatchBoardArgs = { boardId: string } & PatchBoardAttributes

export type ReorderBoardArgs = {
  boardId: string
  putAfterItemId: string | null
}

export type UploadBoardCoverArgs = {
  boardId: string
  file: File
}

export type BoardPayload<T> = JsonApiPayload<"boards", T>
