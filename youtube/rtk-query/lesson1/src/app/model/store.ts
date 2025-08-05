import { baseApi } from '@/app/api/baseApi.ts'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)
