import { configureStore } from '@reduxjs/toolkit'

import { authSlice } from '@/features/auth'
import { playlistsSlice } from '@/features/playlists'
import { tracksSlice } from '@/features/tracks'
import { playerSlice, playerMiddleware } from '@/player'

import { baseApi } from '../api'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authSlice.name]: authSlice.reducer,
    [playlistsSlice.name]: playlistsSlice.reducer,
    [tracksSlice.name]: tracksSlice.reducer,
    [playerSlice.name]: playerSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(playerMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
