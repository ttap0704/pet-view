import { combineReducers } from "redux";

// models
import UserReducer from "./models/user"
import RestaurantReducer from "./models/restaurant";
import AccommodationReducer from "./models/accommodation";

// common
import UploadReducer from "./common/upload";
import RoutesReducer from './common/routes'


const rootReducer = combineReducers({
    // models
    UserReducer,
    RestaurantReducer,
    AccommodationReducer,

    // common
    UploadReducer,
    RoutesReducer
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;