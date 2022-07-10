import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: ProgressType = {
  loading: false
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    stopProgress(state) {
      state.loading = false
    },
    startProgress(state) {
      state.loading = true
    },
  },
})

export const { stopProgress, startProgress } = progressSlice.actions
export default progressSlice.reducer