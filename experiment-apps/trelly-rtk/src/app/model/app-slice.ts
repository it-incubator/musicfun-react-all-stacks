import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, type UnknownAction } from "@reduxjs/toolkit"

import { LOCALSTORAGE_KEYS } from "@/common/constants"

export type ThemeMode = "dark" | "light"

export type NotificationSeverity = "success" | "error" | "info"

export type Notification = {
  id: number
  message: string
  severity: NotificationSeverity
}

const getInitialThemeMode = (): ThemeMode => {
  const saved = localStorage.getItem(LOCALSTORAGE_KEYS.themeMode)
  if (saved === "dark" || saved === "light") return saved
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

// RTK Query thunks carry { arg: { type: "query" | "mutation" } } in meta
const isMutationAction = (action: UnknownAction) =>
  (action as { meta?: { arg?: { type?: string } } }).meta?.arg?.type === "mutation"

let notificationId = 0

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: getInitialThemeMode(),
    pendingMutations: 0,
    notification: null as Notification | null,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectIsMutating: (state) => state.pendingMutations > 0,
    selectNotification: (state) => state.notification,
  },
  reducers: (create) => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    showNotificationAC: create.preparedReducer(
      (payload: { message: string; severity?: NotificationSeverity }) => ({
        payload: { id: ++notificationId, message: payload.message, severity: payload.severity ?? "success" },
      }),
      (state, action) => {
        state.notification = action.payload
      },
    ),
    hideNotificationAC: create.reducer((state) => {
      state.notification = null
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => isPending(action) && isMutationAction(action),
        (state) => {
          state.pendingMutations++
        },
      )
      .addMatcher(
        (action) => isAnyOf(isFulfilled, isRejected)(action) && isMutationAction(action),
        (state) => {
          state.pendingMutations = Math.max(0, state.pendingMutations - 1)
        },
      )
  },
})

export const { selectThemeMode, selectIsMutating, selectNotification } = appSlice.selectors
export const { changeThemeModeAC, showNotificationAC, hideNotificationAC } = appSlice.actions
export const appReducer = appSlice.reducer
