import { TaskPriority, TaskStatus } from "@/common/enums"
import type { Meta } from "@/common/types"
import { z } from "zod"

export type GetBoardTasksResponse = {
  data: Task[]
  meta: Meta
}

export type AddTaskResponse = {
  data: {
    id: string
    type: "tasks"
    attributes: TaskAttributes & {
      description: string | null
      boardId: string
      boardTitle: string
    }
  }
}

export type UpdateTaskResponse = {
  id: string
  addedAt: string
  boardId: string
  deadline: string
  deletedAt: string | null
  description: string
  order: number
  priority: number
  startDate: string | null
  status: number
  title: string
  updatedAt: string
  version: number
  board: {
    id: string
    addedAt: string
    deletedAt: string | null
    description: string
    isImportant: boolean
    order: number
    title: string
    updatedAt: string
    userId: string
    version: number
  }
}

export type Task = {
  id: string
  type: "tasks"
  attributes: TaskAttributes
}

export type TaskAttributes = {
  addedAt: string
  attachments: string[]
  deadline: string
  order: number
  priority: TaskPriority
  startDate: string | null
  status: TaskStatus
  title: string
  updatedAt: string
}

// 👴 old with zod
export const DomainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string(),
})

export type DomainTask = z.infer<typeof DomainTaskSchema>

export type UpdateTaskModel = {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}
