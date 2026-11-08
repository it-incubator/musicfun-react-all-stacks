import { z } from "zod"

import { LIMITS } from "@/common/constants"
import { TaskPriority, TaskStatus } from "@/common/enums"

export const taskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title is required" })
      .max(LIMITS.titleMaxLength, { message: `Max ${LIMITS.titleMaxLength} characters` }),
    description: z
      .string()
      .max(LIMITS.descriptionMaxLength, { message: `Max ${LIMITS.descriptionMaxLength} characters` }),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority),
    // yyyy-mm-dd from <input type="date"> or ""
    startDate: z.string(),
    deadline: z.string(),
  })
  .refine(({ startDate, deadline }) => !startDate || !deadline || deadline >= startDate, {
    message: "Deadline can’t be earlier than the start date",
    path: ["deadline"],
  })

export type TaskInputs = z.infer<typeof taskSchema>
