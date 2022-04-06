import { combineReducers } from "redux";

// models
import UserReducer from "./models/user"

const rootReducer = combineReducers({
    // models
    UserReducer,
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;