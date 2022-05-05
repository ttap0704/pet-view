import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';
import { compose, Store, Reducer, AnyAction } from "redux";
import rootReducer, { IState } from ".";

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const is_dev = process.env.NODE_ENV === 'development';

// store 생성
const createStore = () => {
	const store = configureStore({
		reducer: rootReducer as Reducer<IState, AnyAction>,
		devTools: is_dev
	});

	return store;
}

const wrapper = createWrapper(createStore);

export default wrapper;