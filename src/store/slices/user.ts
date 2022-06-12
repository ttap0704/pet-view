import { createSlice, PayloadAction, } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: StoreUserType = {
  uid: 0,
  nickname: "",
  profile_path: "",
  id: 0,
  login_id: '',
  name: '',
  phone: '',
  wrong_num: 0,
  type: 0,
  certification: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser(state) {
      state.uid = 0;
      state.nickname = "";
      state.profile_path = ""
      state.id = 0;
      state.login_id = '';
      state.name = '';
      state.phone = '';
      state.wrong_num = 0;
      state.type = 0;
      state.certification = 0;
    },
    setUser(state, action: PayloadAction<UserType>) {
      state.uid = action.payload.id;
      state.nickname = action.payload.nickname;
      state.profile_path = action.payload.profile_path;
      state.id = action.payload.id;
      state.login_id = action.payload.login_id;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.wrong_num = action.payload.wrong_num;
      state.type = action.payload.type;
      state.certification = action.payload.certification;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      //
    },
  },
})

export const { setUser, resetUser } = userSlice.actions
export default userSlice.reducer