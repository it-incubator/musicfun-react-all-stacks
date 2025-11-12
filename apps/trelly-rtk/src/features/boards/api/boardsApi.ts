import { baseApi } from "@/app/api/baseApi.ts"
import type { Board, BoardsResponse, DomainBoardResponse, UpdateBoardArgs } from "./boardsApi.types.ts"

export const boardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBoards: build.query<DomainBoardResponse, void>({
      query: () => "boards",
      transformResponse: (res: BoardsResponse): DomainBoardResponse => {
        return { ...res, data: res.data.map((board) => ({ ...board, filter: "all" })) }
      },
      providesTags: ["Board"],
    }),
    addBoard: build.mutation<{ data: Board }, { title: string; description?: string }>({
      query: (body) => ({ url: "boards", method: "POST", body }),
      invalidatesTags: ["Board"],
    }),
    removeBoard: build.mutation<void, string, { revertOnError: true }>({
      query: (id) => ({ url: `boards/${id}`, method: "DELETE" }),
      invalidatesTags: ["Board"],
      onQueryStarted: async (boardId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          boardsApi.util.updateQueryData("getBoards", undefined, (state) => {
            const index = state.data.findIndex((board) => board.id === boardId)
            if (index !== -1) state.data.splice(index, 1)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    updateBoardTitle: build.mutation<void, UpdateBoardArgs>({
      query: ({ id, title, isImportant, description }) => ({
        url: `boards/${id}`,
        method: "PUT",
        body: { title, isImportant, description },
      }),
      invalidatesTags: ["Board"],
    }),
  }),
})

export const { useGetBoardsQuery, useAddBoardMutation, useRemoveBoardMutation, useUpdateBoardTitleMutation } = boardsApi
