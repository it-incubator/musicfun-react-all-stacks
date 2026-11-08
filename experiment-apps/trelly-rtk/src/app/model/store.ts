import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { baseApi } from "@/app/api/baseApi.ts"
import { LOCALSTORAGE_KEYS } from "@/common/constants"

import { appReducer, appSlice } from "./app-slice.ts"

export const store = configureStore({
  reducer: {
    [appSlice.name]: appReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

let themeMode = store.getState().app.themeMode
store.subscribe(() => {
  const next = store.getState().app.themeMode
  if (next !== themeMode) {
    themeMode = next
    localStorage.setItem(LOCALSTORAGE_KEYS.themeMode, next)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// для возможности обращения к store в консоли браузера
// @ts-expect-error debug helper
window.store = store
