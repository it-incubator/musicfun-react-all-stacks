import { configureStore } from '@reduxjs/toolkit'

import { authSlice } from '@/features/auth'
import { playlistsSlice } from '@/features/playlists'
import { tracksSlice } from '@/features/tracks'
import { playerMiddleware, playerSlice } from '@/player'

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

export interface RootState {
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>
  [authSlice.name]: ReturnType<typeof authSlice.reducer>
  [playlistsSlice.name]: ReturnType<typeof playlistsSlice.reducer>
  [tracksSlice.name]: ReturnType<typeof tracksSlice.reducer>
  [playerSlice.name]: ReturnType<typeof playerSlice.reducer>
}

export type AppDispatch = typeof store.dispatch
