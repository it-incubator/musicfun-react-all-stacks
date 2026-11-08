import { TaskPriority, TaskStatus } from "@/common/enums"

type Meta = { label: string; color: string }

export const STATUS_META: Record<TaskStatus, Meta> = {
  [TaskStatus.Draft]: { label: "Draft", color: "#94A3B8" },
  [TaskStatus.New]: { label: "New", color: "#3B82F6" },
  [TaskStatus.InProgress]: { label: "In progress", color: "#F59E0B" },
  [TaskStatus.Completed]: { label: "Completed", color: "#22C55E" },
}

// Kanban column order
export const STATUS_ORDER = [TaskStatus.Draft, TaskStatus.New, TaskStatus.InProgress, TaskStatus.Completed]

export const PRIORITY_META: Record<TaskPriority, Meta> = {
  [TaskPriority.Later]: { label: "Later", color: "#94A3B8" },
  [TaskPriority.Low]: { label: "Low", color: "#22C55E" },
  [TaskPriority.Middle]: { label: "Middle", color: "#3B82F6" },
  [TaskPriority.Hi]: { label: "High", color: "#F97316" },
  [TaskPriority.Urgently]: { label: "Urgent", color: "#EF4444" },
}

export const PRIORITY_ORDER = [
  TaskPriority.Urgently,
  TaskPriority.Hi,
  TaskPriority.Middle,
  TaskPriority.Low,
  TaskPriority.Later,
]
