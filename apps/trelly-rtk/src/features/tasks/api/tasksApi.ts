import { baseApi } from "@/app/api/baseApi.ts"
import { PAGE_SIZE } from "@/common/constants"
import type { AddTaskResponse, GetBoardTasksResponse, UpdateTaskModel, UpdateTaskResponse } from "./tasksApi.types.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBoardTasks: build.query<GetBoardTasksResponse, { boardId: string; params: { page: number } }>({
      query: ({ boardId, params }) => ({ url: `boards/${boardId}/tasks`, params: { ...params, count: PAGE_SIZE } }),
      providesTags: (_result, _error, { boardId }) => [{ type: "Task", id: boardId }],
    }),
    addTask: build.mutation<AddTaskResponse, { boardId: string; title: string }>({
      query: ({ boardId, title }) => ({ url: `boards/${boardId}/tasks`, method: "POST", body: { title } }),
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Task", id: boardId }],
    }),
    removeTask: build.mutation<void, { boardId: string; taskId: string }>({
      query: ({ boardId, taskId }) => ({ url: `boards/${boardId}/tasks/${taskId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Task", id: boardId }],
    }),
    updateTask: build.mutation<
      UpdateTaskResponse,
      { boardId: string; taskId: string; model: UpdateTaskModel; page: number }
    >({
      query: ({ boardId, taskId, model }) => ({ url: `boards/${boardId}/tasks/${taskId}`, method: "PUT", body: model }),
      onQueryStarted: async ({ taskId, model, boardId, page }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getBoardTasks", { boardId, params: { page } }, (state) => {
            const index = state.data.findIndex((task) => task.id === taskId)
            if (index !== -1) {
              state.data[index] = { ...state.data[index], ...model }
            }
          }),
        )

        try {
          await queryFulfilled
        } catch (err) {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Task", id: boardId }],
    }),
  }),
})

export const { useGetBoardTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi
