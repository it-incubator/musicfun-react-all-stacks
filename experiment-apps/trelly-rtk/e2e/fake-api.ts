import { randomUUID } from "node:crypto"

import type { Page, Route } from "@playwright/test"

/**
 * In-memory Trelly backend (https://trelly.it-incubator.app/api) served through page.route.
 * Mirrors the contract and limits of the real API, so UI tests run without the API Hub daily quota.
 */

export const FAKE_USER = { login: "tester", password: "secret", userId: "1" }
const OTHER_USER_ID = "2"

const LIMITS = { boards: 10, tasks: 20, attachments: 5, attachmentSize: 100 * 1024 }

type ImageVariant = {
  type: "original" | "medium" | "thumbnail"
  width: number
  height: number
  fileSize: number
  url: string
}

type Attachment = {
  id: string
  url: string
  contentType: string
  originalName: string
  fileSize: number
  isImage: boolean
  addedAt: string
  images: ImageVariant[]
}

type BoardRecord = {
  id: string
  userId: string
  title: string
  description: string | null
  isImportant: boolean
  order: number
  addedAt: string
  updatedAt: string
  images: ImageVariant[]
}

type TaskRecord = {
  id: string
  boardId: string
  title: string
  description: string | null
  status: number
  priority: number
  startDate: string | null
  deadline: string | null
  order: number
  addedAt: string
  updatedAt: string
  attachments: Attachment[]
}

type Json = Record<string, unknown> | unknown[]

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

let clock = Date.parse("2026-01-01T10:00:00.000Z")
const now = () => new Date((clock += 1000)).toISOString()

const jsonApiError = (status: number, detail: string) => ({
  errors: [{ status: String(status), title: status === 404 ? "Not Found" : "Error", detail }],
})

export class FakeTrellyApi {
  boards: BoardRecord[] = []
  tasks: TaskRecord[] = []
  /** every request the app made, e.g. "PATCH /boards/:id/tasks/:id" */
  log: { method: string; path: string; body: unknown }[] = []

  private validAccessTokens = new Set<string>()
  private validRefreshTokens = new Set<string>()
  private tokenCounter = 0

  // ---- seeding helpers -------------------------------------------------------------------------

  addBoard(attrs: Partial<BoardRecord> & { title: string }, owner: "me" | "other" = "me") {
    const userBoards = this.boards.filter((b) => b.userId === (owner === "me" ? FAKE_USER.userId : OTHER_USER_ID))
    const board: BoardRecord = {
      id: randomUUID(),
      userId: owner === "me" ? FAKE_USER.userId : OTHER_USER_ID,
      description: null,
      isImportant: false,
      order: userBoards.length ? Math.min(...userBoards.map((b) => b.order)) - 1 : 0,
      addedAt: now(),
      updatedAt: now(),
      images: [],
      ...attrs,
    }
    this.boards.push(board)
    return board
  }

  addTask(boardId: string, attrs: Partial<TaskRecord> & { title: string }) {
    const boardTasks = this.tasksOf(boardId)
    const task: TaskRecord = {
      id: randomUUID(),
      boardId,
      description: null,
      status: 0,
      priority: 1,
      startDate: null,
      deadline: null,
      order: boardTasks.length ? Math.min(...boardTasks.map((t) => t.order)) - 1 : 0,
      addedAt: now(),
      updatedAt: now(),
      attachments: [],
      ...attrs,
    }
    this.tasks.push(task)
    return task
  }

  /** Simulates an expired access token: the next authorized request gets 401 and the app must refresh */
  expireAccessTokens() {
    this.validAccessTokens.clear()
  }

  /** Token pair that can be put into localStorage to start a test already logged in */
  issueTokens() {
    const n = ++this.tokenCounter
    const tokens = { accessToken: `access-${n}`, refreshToken: `refresh-${n}` }
    this.validAccessTokens.add(tokens.accessToken)
    this.validRefreshTokens.add(tokens.refreshToken)
    return tokens
  }

  requests(method: string, pathRe: RegExp) {
    return this.log.filter((r) => r.method === method && pathRe.test(r.path))
  }

  tasksOf(boardId: string) {
    return this.tasks.filter((t) => t.boardId === boardId).sort((a, b) => a.order - b.order)
  }

  myBoards() {
    return this.boards.filter((b) => b.userId === FAKE_USER.userId).sort((a, b) => a.order - b.order)
  }

  // ---- wiring ----------------------------------------------------------------------------------

  async install(page: Page) {
    await page.route(/trelly\.it-incubator\.app\/api\/1\.0\//, (route) => this.handle(route))
  }

  private async handle(route: Route) {
    const request = route.request()
    const method = request.method()
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    }
    if (method === "OPTIONS") return route.fulfill({ status: 204, headers: cors })

    const url = new URL(request.url())
    const path = url.pathname.replace(/^\/api\/1\.0/, "")
    const contentType = request.headers()["content-type"] ?? ""
    const body = contentType.includes("application/json") ? request.postDataJSON() : undefined
    this.log.push({ method, path, body })

    const auth = request.headers()["authorization"]?.replace("Bearer ", "")
    const userId = auth && this.validAccessTokens.has(auth) ? FAKE_USER.userId : null

    const { status, json } = this.dispatch(
      method,
      path,
      url.searchParams,
      body,
      userId,
      request.postDataBuffer(),
      contentType,
    )
    return route.fulfill({
      status,
      headers: { ...cors, "content-type": "application/json" },
      body: json === undefined ? "" : JSON.stringify(json),
    })
  }

  private dispatch(
    method: string,
    path: string,
    query: URLSearchParams,
    body: Record<string, any> | undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
    userId: string | null,
    raw: Buffer | null,
    contentType: string,
  ): { status: number; json?: Json } {
    const unauthorized = { status: 401, json: { message: "Unauthorized", statusCode: 401 } }
    const seg = path.split("/").filter(Boolean)

    // ---- auth
    if (path === "/auth/simple/login" && method === "POST") {
      if (body?.login !== FAKE_USER.login || body?.password !== FAKE_USER.password) {
        return { status: 401, json: { message: "Invalid login or password", error: "Unauthorized", statusCode: 401 } }
      }
      return { status: 201, json: this.issueTokens() }
    }
    if ((path === "/auth/simple/refresh" || path === "/auth/refresh") && method === "POST") {
      if (!this.validRefreshTokens.delete(body?.refreshToken)) return unauthorized
      return { status: 201, json: this.issueTokens() }
    }
    if ((path === "/auth/simple/logout" || path === "/auth/logout") && method === "POST") {
      this.validRefreshTokens.delete(body?.refreshToken)
      return { status: 204 }
    }
    if (path === "/auth/me" && method === "GET") {
      return userId ? { status: 200, json: { userId, login: FAKE_USER.login } } : unauthorized
    }

    // ---- public lists
    if (path === "/boards" && method === "GET") {
      const { pageNumber, pageSize } = this.pagination(query)
      const all = [...this.boards].sort((a, b) => a.addedAt.localeCompare(b.addedAt))
      return { status: 200, json: this.page(all, pageNumber, pageSize, (b) => this.boardDto(b)) as Json }
    }
    if (path === "/boards/tasks" && method === "GET") {
      const { pageNumber, pageSize } = this.pagination(query)
      const all = [...this.tasks].sort((a, b) => b.addedAt.localeCompare(a.addedAt))
      const result = this.page(all, pageNumber, pageSize, (t) => this.globalTaskDto(t))
      return {
        status: 200,
        json: { ...result, included: this.included(all.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)) },
      }
    }
    if (path === "/boards/my" && method === "GET") {
      if (!userId) return unauthorized
      return { status: 200, json: { data: this.myBoards().map((b) => this.boardDto(b)) } }
    }
    if (path === "/boards" && method === "POST") {
      if (!userId) return unauthorized
      const title = body?.data?.attributes?.title
      if (body?.data?.type !== "boards" || typeof title !== "string" || !title.length || title.length > 100) {
        return { status: 400, json: jsonApiError(400, "title must be 1–100 characters") }
      }
      if (this.myBoards().length >= LIMITS.boards)
        return { status: 403, json: jsonApiError(403, "Maximum board count (10) reached") }
      const board = this.addBoard({ title, description: body.data.attributes.description ?? null })
      return { status: 201, json: { data: this.boardDto(board) } }
    }

    // ---- /boards/:boardId...
    const boardId = seg[1]
    if (seg[0] !== "boards" || !boardId) return { status: 404, json: jsonApiError(404, "Not found") }
    if (!UUID_RE.test(boardId)) return { status: 400, json: jsonApiError(400, "boardId must be a UUID") }
    const board = this.boards.find((b) => b.id === boardId)
    const ownerCheck = (): { status: number; json?: Json } | null => {
      if (!userId) return unauthorized
      if (!board) return { status: 404, json: jsonApiError(404, "Board not found") }
      if (board.userId !== userId) return { status: 403, json: jsonApiError(403, "The board belongs to another user") }
      return null
    }

    if (seg.length === 2) {
      if (method === "GET") {
        return board
          ? { status: 200, json: { data: this.boardDto(board) } }
          : { status: 404, json: jsonApiError(404, "Board not found") }
      }
      const denied = ownerCheck()
      if (denied) return denied
      if (method === "PUT" || method === "PATCH") {
        const attrs = body?.data?.attributes ?? {}
        if (method === "PUT" && (!("title" in attrs) || !("description" in attrs) || !("isImportant" in attrs))) {
          return { status: 400, json: jsonApiError(400, "every attribute is required") }
        }
        Object.assign(board!, pick(attrs, ["title", "description", "isImportant"]), { updatedAt: now() })
        return { status: 200, json: { data: this.boardDto(board!) } }
      }
      if (method === "DELETE") {
        this.boards = this.boards.filter((b) => b.id !== boardId)
        this.tasks = this.tasks.filter((t) => t.boardId !== boardId)
        return { status: 204 }
      }
    }

    if (seg[2] === "reorder" && method === "PUT") {
      const denied = ownerCheck()
      if (denied) return denied
      const ordered = reorder(this.myBoards(), boardId, body?.putAfterItemId ?? null)
      if (!ordered) return { status: 404, json: jsonApiError(404, "putAfterItemId is not one of your boards") }
      ordered.forEach((b, i) => (b.order = i))
      return { status: 204 }
    }

    if (seg[2] === "images" && seg[3] === "main" && method === "POST") {
      const denied = ownerCheck()
      if (denied) return denied
      const file = parseMultipart(raw, contentType).find((p) => p.name === "file")
      if (!file) return { status: 400, json: jsonApiError(400, "No file provided") }
      board!.images = [{ type: "original", width: 1000, height: 600, fileSize: file.data.length, url: dataUrl(file) }]
      return { status: 201, json: { main: board!.images } }
    }

    // ---- /boards/:boardId/tasks...
    if (seg[2] !== "tasks") return { status: 404, json: jsonApiError(404, "Not found") }
    const taskId = seg[3]

    if (!taskId) {
      if (method === "GET") {
        const { pageNumber, pageSize } = this.pagination(query)
        const all = this.tasksOf(boardId)
        return {
          status: 200,
          json: { ...this.page(all, pageNumber, pageSize, (t) => this.boardTaskDto(t)), included: this.included(all) },
        }
      }
      if (method === "POST") {
        const denied = ownerCheck()
        if (denied) return denied
        const title = body?.data?.attributes?.title
        if (typeof title !== "string" || !title.length || title.length > 100) {
          return { status: 400, json: jsonApiError(400, "title is not 1–100 characters") }
        }
        if (this.tasksOf(boardId).length >= LIMITS.tasks)
          return { status: 403, json: jsonApiError(403, "The board already has 20 tasks") }
        const task = this.addTask(boardId, { title })
        return { status: 201, json: this.taskDetails(task) }
      }
    }

    if (!UUID_RE.test(taskId)) return { status: 400, json: jsonApiError(400, "taskId must be a UUID") }
    const task = this.tasks.find((t) => t.id === taskId)

    if (seg.length === 4 && method === "GET") {
      return task
        ? { status: 200, json: this.taskDetails(task) }
        : { status: 404, json: jsonApiError(404, "Task not found") }
    }

    const denied = ownerCheck()
    if (denied) return denied
    if (!task || (task.boardId !== boardId && seg[4] !== "attachments")) {
      return { status: 404, json: jsonApiError(404, "No task with this ID in this board") }
    }

    if (seg.length === 4) {
      if (method === "PUT" || method === "PATCH") {
        const attrs = body?.data?.attributes ?? {}
        const keys = ["title", "description", "status", "priority", "startDate", "deadline"]
        if (method === "PUT" && keys.some((k) => !(k in attrs))) {
          return { status: 400, json: jsonApiError(400, "an attribute is missing") }
        }
        Object.assign(task, pick(attrs, keys), { updatedAt: now() })
        return { status: 200, json: this.taskDetails(task) }
      }
      if (method === "DELETE") {
        this.tasks = this.tasks.filter((t) => t.id !== taskId)
        return { status: 204 }
      }
    }

    if (seg[4] === "reorder" && method === "PUT") {
      const ordered = reorder(this.tasksOf(boardId), taskId, body?.putAfterItemId ?? null)
      if (!ordered) return { status: 404, json: jsonApiError(404, "putAfterItemId not found in the board") }
      ordered.forEach((t, i) => (t.order = i))
      return { status: 204 }
    }

    if (seg[4] === "move" && method === "PUT") {
      const target = this.boards.find((b) => b.id === body?.targetBoardId)
      if (!target) return { status: 404, json: jsonApiError(404, "Target board not found") }
      if (target.userId !== userId)
        return { status: 403, json: jsonApiError(403, "The target board belongs to another user") }
      if (this.tasksOf(target.id).length >= LIMITS.tasks)
        return { status: 403, json: jsonApiError(403, "The target board already has 20 tasks") }
      task.boardId = target.id
      const ordered = reorder(this.tasksOf(target.id), taskId, body?.putAfterItemId ?? null)
      if (!ordered) return { status: 404, json: jsonApiError(404, "putAfterItemId not found in the target board") }
      ordered.forEach((t, i) => (t.order = i))
      return { status: 204 }
    }

    if (seg[4] === "attachments") {
      if (method === "POST" && seg.length === 5) {
        const files = parseMultipart(raw, contentType).filter((p) => p.name === "files")
        if (!files.length) return { status: 400, json: jsonApiError(400, "No files sent") }
        const big = files.find((f) => f.data.length > LIMITS.attachmentSize)
        if (big) return { status: 400, json: jsonApiError(400, `File ${big.filename} is larger than 100 KB`) }
        if (task.attachments.length + files.length > LIMITS.attachments) {
          return { status: 403, json: jsonApiError(403, "Maximum 5 attachments allowed per task") }
        }
        for (const file of files) {
          const isImage = file.contentType.startsWith("image/")
          const url = dataUrl(file)
          task.attachments.push({
            id: randomUUID(),
            url,
            contentType: file.contentType,
            originalName: file.filename,
            fileSize: file.data.length,
            isImage,
            addedAt: now(),
            images: isImage ? [{ type: "original", width: 100, height: 100, fileSize: file.data.length, url }] : [],
          })
        }
        return { status: 201, json: this.taskDetails(task) }
      }
      if (method === "DELETE" && seg[5]) {
        const before = task.attachments.length
        task.attachments = task.attachments.filter((a) => a.id !== seg[5])
        return before === task.attachments.length
          ? { status: 404, json: jsonApiError(404, "The attachment does not belong to the task") }
          : { status: 204 }
      }
    }

    return { status: 404, json: jsonApiError(404, `No fake route for ${method} ${path}`) }
  }

  // ---- DTOs ------------------------------------------------------------------------------------

  private pagination(query: URLSearchParams) {
    return { pageNumber: Number(query.get("pageNumber") ?? 1), pageSize: Number(query.get("pageSize") ?? 10) }
  }

  private page<T>(items: T[], pageNumber: number, pageSize: number, map: (item: T) => unknown) {
    return {
      data: items.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map(map),
      meta: { page: pageNumber, pageSize, totalCount: items.length, pagesCount: Math.ceil(items.length / pageSize) },
    }
  }

  private boardDto(b: BoardRecord) {
    const { title, description, addedAt, updatedAt, order, isImportant, images } = b
    return {
      id: b.id,
      type: "boards",
      attributes: { title, description, addedAt, updatedAt, order, isImportant, images: { main: images } },
    }
  }

  private relationships(t: TaskRecord) {
    return { board: { data: { id: t.boardId, type: "boards" } } }
  }

  private boardTaskDto(t: TaskRecord) {
    const { title, addedAt, order, status, priority, startDate, deadline, updatedAt, attachments } = t
    return {
      id: t.id,
      type: "tasks",
      attributes: { title, addedAt, order, status, priority, startDate, deadline, updatedAt, attachments },
      relationships: this.relationships(t),
    }
  }

  private globalTaskDto(t: TaskRecord) {
    const { title, status, priority, addedAt } = t
    return {
      id: t.id,
      type: "tasks",
      attributes: { title, status, priority, addedAt, attachmentsCount: t.attachments.length },
      relationships: this.relationships(t),
    }
  }

  private taskDetails(t: TaskRecord) {
    const dto = this.boardTaskDto(t)
    return {
      data: { ...dto, attributes: { ...dto.attributes, description: t.description } },
      included: this.included([t]),
    }
  }

  private included(tasks: TaskRecord[]) {
    const ids = [...new Set(tasks.map((t) => t.boardId))]
    return ids
      .map((id) => this.boards.find((b) => b.id === id))
      .filter(Boolean)
      .map((b) => ({ id: b!.id, type: "boards", attributes: { title: b!.title } }))
  }
}

// ---- helpers -----------------------------------------------------------------------------------

const pick = (obj: Record<string, unknown>, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)))

/** Same semantics as the backend: put the item right after putAfterItemId, null → first */
const reorder = <T extends { id: string }>(items: T[], id: string, putAfterItemId: string | null): T[] | null => {
  const item = items.find((i) => i.id === id)
  if (!item) return null
  const rest = items.filter((i) => i.id !== id)
  if (putAfterItemId === null) return [item, ...rest]
  const index = rest.findIndex((i) => i.id === putAfterItemId)
  if (index === -1) return null
  rest.splice(index + 1, 0, item)
  return rest
}

type Part = { name: string; filename: string; contentType: string; data: Buffer }

const parseMultipart = (raw: Buffer | null, contentType: string): Part[] => {
  const boundary = contentType.match(/boundary=(.+)$/)?.[1]
  if (!raw || !boundary) return []
  const parts: Part[] = []
  const delimiter = Buffer.from(`--${boundary}`)
  let start = raw.indexOf(delimiter)
  while (start !== -1) {
    const next = raw.indexOf(delimiter, start + delimiter.length)
    if (next === -1) break
    const chunk = raw.subarray(start + delimiter.length + 2, next - 2) // skip \r\n after delimiter and before next
    const headerEnd = chunk.indexOf("\r\n\r\n")
    const headers = chunk.subarray(0, headerEnd).toString("utf8")
    parts.push({
      name: headers.match(/name="([^"]+)"/)?.[1] ?? "",
      filename: headers.match(/filename="([^"]*)"/)?.[1] ?? "",
      contentType: headers.match(/Content-Type: (.+)/i)?.[1]?.trim() ?? "application/octet-stream",
      data: chunk.subarray(headerEnd + 4),
    })
    start = next
  }
  return parts
}

const dataUrl = (file: Part) => `data:${file.contentType};base64,${file.data.toString("base64")}`
