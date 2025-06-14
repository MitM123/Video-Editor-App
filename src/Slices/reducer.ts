import { combineReducers } from "@reduxjs/toolkit";
import videoReducer from "./Video/Video.slice";


const reducer = combineReducers(
    {
        video: videoReducer,
    }
)

export default reducer;
