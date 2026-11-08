import { OAUTH_CALLBACK_PATH } from "@/common/constants"

export const Path = {
  Main: "/",
  MyBoards: "/my",
  Board: "/boards/:boardId",
  Task: "/boards/:boardId/tasks/:taskId",
  Login: "/login",
  OAuthRedirect: OAUTH_CALLBACK_PATH,
  NotFound: "*",
} as const

export const boardPath = (boardId: string) => `/boards/${boardId}`
export const taskPath = (boardId: string, taskId: string) => `/boards/${boardId}/tasks/${taskId}`
