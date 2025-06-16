import { configureStore } from "@reduxjs/toolkit";
import { tracksAPI } from "../features/tracks/api/tracksApi.ts";

export const store = configureStore({
  reducer: {
    [tracksAPI.reducerPath]: tracksAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tracksAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
