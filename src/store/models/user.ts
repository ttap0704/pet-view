import { HYDRATE } from 'next-redux-wrapper';
import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

const initialState: UserType = {
  uid: null,
  unick: "",
  profile_path: ""
}

export const RESET_USER = "userReducer/RESET_USER";
export const SET_USER = "userReducer/SET_USER";

export const resetUser = createAction(RESET_USER)();
export const setUser = createAction(SET_USER)<UserType>();
export const globalSetUser = createAction(HYDRATE)<UserType>();

export const actions = { resetUser, setUser, globalSetUser }
type UserReducerActions = ActionType<typeof actions>;

const userReducer = createReducer<UserType, UserReducerActions>(initialState, {
  [RESET_USER]: () => ({
    uid: null,
    unick: "",
    profile_path: ""
  }),
  [HYDRATE]: (state, action) => {
    console.log(state);
    return ({
      uid: action.payload.uid,
      unick: action.payload.unick,
      profile_path: action.payload.profile_path
    })
  },
  [SET_USER]: (state, action) => {
    return ({
      uid: action.payload.uid,
      unick: action.payload.unick,
      profile_path: action.payload.profile_path
    })
  },
})

export default userReducer;