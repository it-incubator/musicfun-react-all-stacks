import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"

import { baseApi } from "@/app/api/baseApi.ts"
import { LIMITS } from "@/common/constants"
import { moveAfter } from "@/common/utils"

import type {
  BoardTask,
  CreateTaskArgs,
  DeleteAttachmentArgs,
  GetBoardTasksArgs,
  GetBoardTasksResponse,
  GetGlobalTasksArgs,
  GetGlobalTasksResponse,
  MoveTaskArgs,
  PatchTaskArgs,
  PatchTaskAttributes,
  ReorderTaskArgs,
  ReplaceTaskArgs,
  ReplaceTaskAttributes,
  TaskIds,
  TaskPayload,
  TaskResponse,
  UploadAttachmentsArgs,
} from "./tasksApi.types.ts"

const toPayload = <T>(attributes: T): TaskPayload<T> => ({ data: { type: "tasks", attributes } })

const taskUrl = ({ boardId, taskId }: TaskIds) => `boards/${boardId}/tasks/${taskId}`

// A board holds at most 20 tasks and pageSize max is 20, so one page is the whole board
export const BOARD_TASKS_ARGS = (boardId: string): GetBoardTasksArgs => ({ boardId, pageSize: LIMITS.tasksPerBoard })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dispatch = ThunkDispatch<any, unknown, UnknownAction>
type GetState = () => unknown

/** Applies a recipe to every cached page of a board's task list, returns undo callbacks */
const patchBoardTasks = (
  dispatch: Dispatch,
  getState: GetState,
  boardId: string,
  recipe: (state: GetBoardTasksResponse) => void,
) =>
  tasksApi.util
    .selectCachedArgsForQuery(getState() as never, "getBoardTasks")
    .filter((args) => args.boardId === boardId)
    .map((args) => dispatch(tasksApi.util.updateQueryData("getBoardTasks", args, recipe)))

const toBoardTask = (task: TaskResponse["data"]): BoardTask => {
  const { description: _description, ...attributes } = task.attributes
  return { ...task, attributes }
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Tasks Public (no authorization required)
    getGlobalTasks: build.query<GetGlobalTasksResponse, GetGlobalTasksArgs>({
      query: (params) => ({ url: "boards/tasks", params }),
      providesTags: ["GlobalTasks"],
    }),
    getBoardTasks: build.query<GetBoardTasksResponse, GetBoardTasksArgs>({
      query: ({ boardId, ...params }) => ({ url: `boards/${boardId}/tasks`, params }),
      providesTags: (_result, _error, { boardId }) => [{ type: "BoardTasks", id: boardId }],
    }),
    getTask: build.query<TaskResponse, TaskIds>({
      query: taskUrl,
      providesTags: (_result, _error, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    // Tasks Owner
    createTask: build.mutation<TaskResponse, CreateTaskArgs>({
      query: ({ boardId, title }) => ({ url: `boards/${boardId}/tasks`, method: "POST", body: toPayload({ title }) }),
      invalidatesTags: (_result, error, { boardId }) =>
        error ? [] : [{ type: "BoardTasks", id: boardId }, "GlobalTasks"],
    }),
    // PUT: full replacement — every attribute is required
    replaceTask: build.mutation<TaskResponse, ReplaceTaskArgs>({
      query: ({ attributes, ...ids }) => ({
        url: taskUrl(ids),
        method: "PUT",
        body: toPayload<ReplaceTaskAttributes>(attributes),
      }),
      onQueryStarted: async ({ boardId, taskId }, { dispatch, getState, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(tasksApi.util.upsertQueryData("getTask", { boardId, taskId }, data))
          patchBoardTasks(dispatch, getState, boardId, (state) => {
            const index = state.data.findIndex((t) => t.id === taskId)
            if (index !== -1) state.data[index] = toBoardTask(data.data)
          })
        } catch {
          // error is shown by the base query
        }
      },
      invalidatesTags: (_result, error) => (error ? [] : ["GlobalTasks"]),
    }),
    // PATCH: partial update with optimistic UI (e.g. only the status)
    patchTask: build.mutation<TaskResponse, PatchTaskArgs>({
      query: ({ attributes, ...ids }) => ({
        url: taskUrl(ids),
        method: "PATCH",
        body: toPayload<PatchTaskAttributes>(attributes),
      }),
      onQueryStarted: async ({ boardId, taskId, attributes }, { dispatch, getState, queryFulfilled }) => {
        const patches = [
          ...patchBoardTasks(dispatch, getState, boardId, (state) => {
            const task = state.data.find((t) => t.id === taskId)
            if (task) Object.assign(task.attributes, attributes)
          }),
          dispatch(
            tasksApi.util.updateQueryData("getTask", { boardId, taskId }, (state) => {
              Object.assign(state.data.attributes, attributes)
            }),
          ),
        ]
        try {
          const { data } = await queryFulfilled
          dispatch(tasksApi.util.upsertQueryData("getTask", { boardId, taskId }, data))
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: (_result, error) => (error ? [] : ["GlobalTasks"]),
    }),
    deleteTask: build.mutation<void, TaskIds>({
      query: (ids) => ({ url: taskUrl(ids), method: "DELETE" }),
      onQueryStarted: async ({ boardId, taskId }, { dispatch, getState, queryFulfilled }) => {
        const patches = patchBoardTasks(dispatch, getState, boardId, (state) => {
          state.data = state.data.filter((t) => t.id !== taskId)
          state.meta.totalCount = state.data.length
        })
        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: (_result, error) => (error ? [] : ["GlobalTasks"]),
    }),
    // Moves the task right after putAfterItemId within the same board (null → first)
    reorderTask: build.mutation<void, ReorderTaskArgs>({
      query: ({ putAfterItemId, ...ids }) => ({
        url: `${taskUrl(ids)}/reorder`,
        method: "PUT",
        body: { putAfterItemId },
      }),
      onQueryStarted: async ({ boardId, taskId, putAfterItemId }, { dispatch, getState, queryFulfilled }) => {
        const patches = patchBoardTasks(dispatch, getState, boardId, (state) => {
          state.data = moveAfter(state.data, taskId, putAfterItemId)
        })
        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
    }),
    // Moves the task to another board of the same owner
    moveTask: build.mutation<void, MoveTaskArgs>({
      query: ({ targetBoardId, putAfterItemId, ...ids }) => ({
        url: `${taskUrl(ids)}/move`,
        method: "PUT",
        body: { targetBoardId, putAfterItemId },
      }),
      onQueryStarted: async ({ boardId, taskId }, { dispatch, getState, queryFulfilled }) => {
        const patches = patchBoardTasks(dispatch, getState, boardId, (state) => {
          state.data = state.data.filter((t) => t.id !== taskId)
          state.meta.totalCount = state.data.length
        })
        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: (_result, error, { boardId, targetBoardId, taskId }) =>
        error
          ? []
          : [
              { type: "BoardTasks", id: boardId },
              { type: "BoardTasks", id: targetBoardId },
              { type: "Task", id: taskId },
              "GlobalTasks",
            ],
    }),
    // multipart/form-data, field "files"; responds with the whole updated task
    uploadAttachments: build.mutation<TaskResponse, UploadAttachmentsArgs>({
      query: ({ files, ...ids }) => {
        const formData = new FormData()
        files.forEach((file) => formData.append("files", file))
        return { url: `${taskUrl(ids)}/attachments`, method: "POST", body: formData }
      },
      onQueryStarted: async ({ boardId, taskId }, { dispatch, getState, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(tasksApi.util.upsertQueryData("getTask", { boardId, taskId }, data))
          patchBoardTasks(dispatch, getState, boardId, (state) => {
            const task = state.data.find((t) => t.id === taskId)
            if (task) task.attributes.attachments = data.data.attributes.attachments
          })
        } catch {
          // error is shown by the base query
        }
      },
      invalidatesTags: (_result, error) => (error ? [] : ["GlobalTasks"]),
    }),
    deleteAttachment: build.mutation<void, DeleteAttachmentArgs>({
      query: ({ attachmentId, ...ids }) => ({ url: `${taskUrl(ids)}/attachments/${attachmentId}`, method: "DELETE" }),
      onQueryStarted: async ({ boardId, taskId, attachmentId }, { dispatch, getState, queryFulfilled }) => {
        const removeAttachment = (attributes: { attachments: { id: string }[] }) => {
          attributes.attachments = attributes.attachments.filter((a) => a.id !== attachmentId)
        }
        const patches = [
          dispatch(
            tasksApi.util.updateQueryData("getTask", { boardId, taskId }, (state) => {
              removeAttachment(state.data.attributes)
            }),
          ),
          ...patchBoardTasks(dispatch, getState, boardId, (state) => {
            const task = state.data.find((t) => t.id === taskId)
            if (task) removeAttachment(task.attributes)
          }),
        ]
        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: (_result, error) => (error ? [] : ["GlobalTasks"]),
    }),
  }),
})

export const {
  useGetGlobalTasksQuery,
  useGetBoardTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useReplaceTaskMutation,
  usePatchTaskMutation,
  useDeleteTaskMutation,
  useReorderTaskMutation,
  useMoveTaskMutation,
  useUploadAttachmentsMutation,
  useDeleteAttachmentMutation,
} = tasksApi
