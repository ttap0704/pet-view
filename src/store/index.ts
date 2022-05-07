import { AnyAction, CombinedState, combineReducers } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'

import userReducer from './slices/user'

export interface IState {
	userReducer: UserType
}
// models

const rootReducer = (state: IState, action: AnyAction): CombinedState<IState> => {
	console.log(action.type, userReducer);
	console.log(state, 'istate');
	switch (action.type) {
		case HYDRATE:
			return action.payload;
		default:
			const combineReducer = combineReducers({
				// models
				userReducer,
			})
			return combineReducer(state, action)
	}
};


export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
