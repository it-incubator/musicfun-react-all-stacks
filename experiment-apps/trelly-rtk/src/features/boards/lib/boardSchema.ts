import { z } from "zod"

import { LIMITS } from "@/common/constants"

export const boardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(LIMITS.titleMaxLength, { message: `Max ${LIMITS.titleMaxLength} characters` }),
  description: z
    .string()
    .trim()
    .max(LIMITS.descriptionMaxLength, { message: `Max ${LIMITS.descriptionMaxLength} characters` }),
  isImportant: z.boolean(),
})

export type BoardInputs = z.infer<typeof boardSchema>
