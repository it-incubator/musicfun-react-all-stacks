import { baseApi } from "@/app/api/baseApi.ts"
import { moveAfter } from "@/common/utils"

import type {
  Board,
  BoardImages,
  BoardPayload,
  BoardResponse,
  CreateBoardAttributes,
  GetBoardsArgs,
  GetBoardsResponse,
  GetMyBoardsResponse,
  PatchBoardArgs,
  PatchBoardAttributes,
  ReorderBoardArgs,
  ReplaceBoardArgs,
  ReplaceBoardAttributes,
  UploadBoardCoverArgs,
} from "./boardsApi.types.ts"

const toPayload = <T>(attributes: T): BoardPayload<T> => ({ data: { type: "boards", attributes } })

const MY_LIST = { type: "Board", id: "MY_LIST" } as const
const PUBLIC_LIST = { type: "Board", id: "PUBLIC_LIST" } as const

export const boardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Boards Owner
    getMyBoards: build.query<GetMyBoardsResponse, void>({
      query: () => "boards/my",
      providesTags: (result) => [MY_LIST, ...(result?.data.map(({ id }) => ({ type: "Board" as const, id })) ?? [])],
    }),
    createBoard: build.mutation<BoardResponse, CreateBoardAttributes>({
      query: (attributes) => ({ url: "boards", method: "POST", body: toPayload(attributes) }),
      invalidatesTags: [MY_LIST, PUBLIC_LIST],
    }),
    // PUT: full replacement — every attribute is required
    replaceBoard: build.mutation<BoardResponse, ReplaceBoardArgs>({
      query: ({ boardId, ...attributes }) => ({
        url: `boards/${boardId}`,
        method: "PUT",
        body: toPayload<ReplaceBoardAttributes>(attributes),
      }),
      invalidatesTags: (_result, _error, { boardId }) => [{ type: "Board", id: boardId }, MY_LIST, PUBLIC_LIST],
    }),
    // PATCH: partial update with optimistic UI
    patchBoard: build.mutation<BoardResponse, PatchBoardArgs>({
      query: ({ boardId, ...attributes }) => ({
        url: `boards/${boardId}`,
        method: "PATCH",
        body: toPayload<PatchBoardAttributes>(attributes),
      }),
      onQueryStarted: async ({ boardId, ...attributes }, { dispatch, queryFulfilled }) => {
        const patches = [
          dispatch(
            boardsApi.util.updateQueryData("getMyBoards", undefined, (state) => {
              const board = state.data.find((b) => b.id === boardId)
              if (board) Object.assign(board.attributes, attributes)
            }),
          ),
          dispatch(
            boardsApi.util.updateQueryData("getBoard", boardId, (state) => {
              Object.assign(state.data.attributes, attributes)
            }),
          ),
        ]
        try {
          const { data } = await queryFulfilled
          dispatch(boardsApi.util.upsertQueryData("getBoard", boardId, data))
        } catch {
          patches.forEach((patch) => patch.undo())
        }
      },
      invalidatesTags: [PUBLIC_LIST],
    }),
    deleteBoard: build.mutation<void, string>({
      query: (boardId) => ({ url: `boards/${boardId}`, method: "DELETE" }),
      onQueryStarted: async (boardId, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          boardsApi.util.updateQueryData("getMyBoards", undefined, (state) => {
            state.data = state.data.filter((board) => board.id !== boardId)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: (_result, error) => (error ? [MY_LIST] : [PUBLIC_LIST, "GlobalTasks"]),
    }),
    // Moves the board right after putAfterItemId (null → first position)
    reorderBoard: build.mutation<void, ReorderBoardArgs>({
      query: ({ boardId, putAfterItemId }) => ({
        url: `boards/${boardId}/reorder`,
        method: "PUT",
        body: { putAfterItemId },
      }),
      onQueryStarted: async ({ boardId, putAfterItemId }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          boardsApi.util.updateQueryData("getMyBoards", undefined, (state) => {
            state.data = moveAfter(state.data, boardId, putAfterItemId)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    uploadBoardCover: build.mutation<BoardImages, UploadBoardCoverArgs>({
      query: ({ boardId, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        return { url: `boards/${boardId}/images/main`, method: "POST", body: formData }
      },
      invalidatesTags: (_result, error, { boardId }) => (error ? [] : [{ type: "Board", id: boardId }, PUBLIC_LIST]),
    }),

    // Boards Public (no authorization required)
    getBoards: build.query<GetBoardsResponse, GetBoardsArgs>({
      query: (params) => ({ url: "boards", params }),
      providesTags: [PUBLIC_LIST],
    }),
    getBoard: build.query<BoardResponse, string>({
      query: (boardId) => `boards/${boardId}`,
      providesTags: (_result, _error, boardId) => [{ type: "Board", id: boardId }],
    }),
  }),
})

export const selectIsMyBoard = (myBoards: Board[] | undefined, boardId: string) =>
  !!myBoards?.some((board) => board.id === boardId)

export const {
  useGetMyBoardsQuery,
  useCreateBoardMutation,
  useReplaceBoardMutation,
  usePatchBoardMutation,
  useDeleteBoardMutation,
  useReorderBoardMutation,
  useUploadBoardCoverMutation,
  useGetBoardsQuery,
  useGetBoardQuery,
} = boardsApi
