import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

const initialState: UserType = {
  uid: undefined,
  unick: "",
  profile_path: ""
}

export const RESET_USER = "userReducer/RESET_USER";
export const SET_USER = "userReducer/SET_USER";

export const resetUser = createAction(RESET_USER)();
export const setUser = createAction(SET_USER)<UserType>();

export const actions = { resetUser, setUser }
type UserReducerActions = ActionType<typeof actions>;

const userReducer = createReducer<UserType, UserReducerActions>(initialState, {
  [RESET_USER]: () => ({
    uid: undefined,
    unick: "",
    profile_path: ""
  }),
  [SET_USER]: (state, action) => {
    console.log(action.payload)
    return ({
      uid: action.payload.uid,
      unick: action.payload.unick,
      profile_path: action.payload.profile_path
    })
  },
})

export default userReducer;