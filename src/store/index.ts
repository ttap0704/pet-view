import { AnyAction, CombinedState, combineReducers } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'

import UserReducer from "./models/user"

export interface IState {
	UserReducer: UserType
}
// models

const rootReducer = (state: IState, action: AnyAction): CombinedState<IState> => {
	switch (action.type) {
		case HYDRATE:
			console.log(action.payload)
			return action.payload;
		default:
			const combineReducer = combineReducers({
				// models
				UserReducer,
			})
			return combineReducer(state, action)

	}
};


export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
