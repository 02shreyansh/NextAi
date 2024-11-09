import {combineReducers} from "redux"
import  chatSlice  from "./reducers/chatSlice"

const rootReducer=combineReducers({
    chat:chatSlice,
})
export default rootReducer
