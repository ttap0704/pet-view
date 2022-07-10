import { AnyAction, CombinedState, combineReducers } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'

import userReducer from './slices/user'
import progressReducer from './slices/progress'

export interface IState {
	userReducer: StoreUserType,
	progressReducer: ProgressType
}
// models

const rootReducer = (state: IState, action: AnyAction): CombinedState<IState> => {
	switch (action.type) {
		case HYDRATE:
			return action.payload;
		default:
			const combineReducer = combineReducers({
				// models
				userReducer,
				progressReducer
			})
			return combineReducer(state, action)
	}
};


export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
