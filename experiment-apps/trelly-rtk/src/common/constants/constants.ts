export const LOCALSTORAGE_KEYS = {
  refreshToken: "trelly-refresh-token",
  accessToken: "trelly-access-token",
  authMethod: "trelly-auth-method",
  themeMode: "trelly-theme-mode",
  boardView: "trelly-board-view",
}

// Backend limits (see https://trelly.it-incubator.app/api)
export const LIMITS = {
  boardsPerUser: 10,
  tasksPerBoard: 20,
  attachmentsPerTask: 5,
  attachmentMaxSize: 100 * 1024,
  coverMinHeight: 500,
  titleMaxLength: 100,
  descriptionMaxLength: 1000,
  pageSizeMax: 20,
}

export const PUBLIC_BOARDS_PAGE_SIZE = 12
export const GLOBAL_TASKS_PAGE_SIZE = 20

export const ATTACHMENT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "text/plain",
  "audio/mpeg",
  "audio/webm;codecs=opus",
  "application/pdf",
]

export const OAUTH_CALLBACK_PATH = "/oauth2/callback"
export const OAUTH_ACCESS_TOKEN_TTL = "15m"
