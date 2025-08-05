import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'app',
  initialState: {
    isAuthModalOpen: false,
  },
  reducers: (create) => ({
    setIsAuthModalOpen: create.reducer<{ isAuthModalOpen: boolean }>((state, action) => {
      state.isAuthModalOpen = action.payload.isAuthModalOpen
    }),
  }),
  selectors: {
    selectIsAuthModalOpen: (state) => state.isAuthModalOpen,
  },
})

export const { setIsAuthModalOpen } = authSlice.actions
export const { selectIsAuthModalOpen } = authSlice.selectors
