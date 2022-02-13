import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

// 상태의 타입 선언
interface RoutesReducer {
  path: string,
  root_path: string
}

// 상태 초기화
const initialState: RoutesReducer = {
  path: '',
  root_path: ''
}

// 액션타입 선언
export const RESET_ROUTES = "routesReducer/RESET_ROUTES";
export const SET_ROUTES = "routesReducer/SET_ROUTES";

// 액션함수 선언
export const resetRoutes = createAction(RESET_ROUTES)();
export const addRoutes = createAction(SET_ROUTES)<RoutesReducer>();

// 액션 객체타입
export const actions = { resetRoutes, addRoutes }
type RoutesReducerActions = ActionType<typeof actions>;

// 리듀서 추가
const routesReducer = createReducer<RoutesReducer, RoutesReducerActions>(initialState, {
  [RESET_ROUTES]: () => ({
    path: '',
    root_path: ''
  }),
  [SET_ROUTES]: (state, action) => {
    return ({
      path: action.payload.path,
      root_path: action.payload.root_path,
    })
  },
})

export default routesReducer;