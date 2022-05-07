import { createSlice, PayloadAction, } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: UserType = {
  uid: null,
  unick: "",
  profile_path: ""
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser(state) {
      state.uid = null;
      state.unick = "";
      state.profile_path = ""
    },
    setUser(state, action: PayloadAction<UserType>) {
      console.log(action.payload)
      state.uid = action.payload.uid;
      state.unick = action.payload.unick;
      state.profile_path = action.payload.profile_path;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log(state, action, 'HYDRATE...');
      // state.count = action.payload.counter.count;
    },
  },
})

export const { setUser, resetUser } = userSlice.actions
export default userSlice.reducer