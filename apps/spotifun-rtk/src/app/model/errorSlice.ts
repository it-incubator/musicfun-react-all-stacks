import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react"

type ErrorState = {
  message: string
}

const initialState: ErrorState = {
  message: "",
}
export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
  },
  selectors: {
    selectError: (state) => state.message,
  },
})

export const { setError } = errorSlice.actions
export const { selectError } = errorSlice.selectors
export const errorReducer = errorSlice.reducer
