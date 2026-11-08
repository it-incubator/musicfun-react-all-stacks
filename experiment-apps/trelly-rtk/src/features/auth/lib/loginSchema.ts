import { z } from "zod"

export const loginSchema = z.object({
  login: z.string().trim().min(1, { message: "Login is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>
