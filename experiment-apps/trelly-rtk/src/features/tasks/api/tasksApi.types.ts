import { TaskPriority, TaskStatus } from "@/common/enums"
import type { ImageVariant, JsonApiMeta, JsonApiPayload, PaginationArgs } from "@/common/types"

export type Attachment = {
  id: string
  url: string
  contentType: string
  originalName: string
  fileSize: number
  isImage: boolean
  addedAt: string
  images: ImageVariant[]
}

export type TaskRelationships = {
  board: { data: { id: string; type: "boards" } }
}

// Boards' titles referenced by tasks (JSON:API compound document)
export type IncludedBoard = {
  id: string
  type: "boards"
  attributes: { title: string }
}

// GET /boards/{boardId}/tasks — items carry no description
export type BoardTaskAttributes = {
  title: string
  addedAt: string
  updatedAt: string
  order: number
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
  attachments: Attachment[]
}

export type BoardTask = {
  id: string
  type: "tasks"
  attributes: BoardTaskAttributes
  relationships: TaskRelationships
}

// GET /boards/tasks — short projection
export type GlobalTaskAttributes = {
  title: string
  status: TaskStatus
  priority: TaskPriority
  addedAt: string
  attachmentsCount: number
}

export type GlobalTask = {
  id: string
  type: "tasks"
  attributes: GlobalTaskAttributes
  relationships: TaskRelationships
}

// GET /boards/{boardId}/tasks/{taskId} — full task
export type TaskDetailsAttributes = BoardTaskAttributes & {
  description: string | null
}

export type TaskDetails = {
  id: string
  type: "tasks"
  attributes: TaskDetailsAttributes
  relationships: TaskRelationships
}

// Response
export type GetBoardTasksResponse = {
  data: BoardTask[]
  included: IncludedBoard[]
  meta: JsonApiMeta
}

export type GetGlobalTasksResponse = {
  data: GlobalTask[]
  included: IncludedBoard[]
  meta: JsonApiMeta
}

export type TaskResponse = {
  data: TaskDetails
  included: IncludedBoard[]
}

// Arguments
export type TaskIds = { boardId: string; taskId: string }

export type GetGlobalTasksArgs = PaginationArgs
export type GetBoardTasksArgs = { boardId: string } & PaginationArgs

export type CreateTaskArgs = { boardId: string; title: string }

export type ReplaceTaskAttributes = {
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}

export type PatchTaskAttributes = Partial<ReplaceTaskAttributes>

export type ReplaceTaskArgs = TaskIds & { attributes: ReplaceTaskAttributes }
export type PatchTaskArgs = TaskIds & { attributes: PatchTaskAttributes }

export type ReorderTaskArgs = TaskIds & { putAfterItemId: string | null }

export type MoveTaskArgs = TaskIds & { targetBoardId: string; putAfterItemId: string | null }

export type UploadAttachmentsArgs = TaskIds & { files: File[] }
export type DeleteAttachmentArgs = TaskIds & { attachmentId: string }

export type TaskPayload<T> = JsonApiPayload<"tasks", T>
