import type { Task, UpdateTaskModel } from "@/features/tasks/api/tasksApi.types.ts"

export const createTaskModel = (task: Task, domainModel: Partial<UpdateTaskModel>): UpdateTaskModel => ({
  status: task.attributes.status,
  title: task.attributes.title,
  priority: task.attributes.priority,
  startDate: task.attributes.startDate,
  // TODO: deadline дублируется с title на бекенде
  deadline: "2025-06-26T11:40:34.962Z",
  // TODO: description не возвращается при GET запросе
  description: "",
  ...domainModel,
})
