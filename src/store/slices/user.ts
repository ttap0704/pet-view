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
  is_mobile: false,
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
      state.is_mobile = false;
      state.likes = {};
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
    setUserMobile(state, action: PayloadAction<{ is_mobile: boolean }>) {
      state.is_mobile = action.payload.is_mobile;
    },
    setUserNickname(state, action: { payload: { nickname: string } }) {
      state.nickname = action.payload.nickname
    },
    setUserProfilePath(state, action: { payload: { profile_path: string | null } }) {
      state.profile_path = action.payload.profile_path;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      //
    },
  },
})

export const { setUser, resetUser, setUserMobile, setUserNickname, setUserProfilePath } = userSlice.actions
export default userSlice.reducer