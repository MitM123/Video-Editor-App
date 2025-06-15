import { combineReducers } from "@reduxjs/toolkit";
import videoReducer from "./Video/Video.slice";
import imageReducer from "./Image/Image.slice";
import stickerReducer from "./Stickers/Stickers.slice";


const reducer = combineReducers(
    {
        video: videoReducer,
        image: imageReducer,
        sticker: stickerReducer
    }
)

export default reducer;
