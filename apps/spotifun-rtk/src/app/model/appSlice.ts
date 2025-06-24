import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    errorMessage: "",
  },
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload
    },
  },
  selectors: {
    selectError: (state) => state.errorMessage,
  },
})

export const { setError } = appSlice.actions
export const { selectError } = appSlice.selectors
export const appReducer = appSlice.reducer
