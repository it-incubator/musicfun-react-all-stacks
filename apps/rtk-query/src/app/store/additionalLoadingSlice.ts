import { createSlice } from '@reduxjs/toolkit'
import type { AdditionalLoadingState } from './additionalLoadingSlice.types'

const additionalLoadingSlice = createSlice({
  name: 'additionalLoading',
  initialState: false as AdditionalLoadingState,
  reducers: {
    setAdditionalLoading: (_state, action) => action.payload,
  },
})

export const { setAdditionalLoading } = additionalLoadingSlice.actions
export default additionalLoadingSlice.reducer
