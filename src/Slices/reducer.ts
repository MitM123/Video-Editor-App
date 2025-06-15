import { combineReducers } from "@reduxjs/toolkit";
import videoReducer from "./Video/Video.slice";
import imageReducer from "./Image/Image.slice";
import stickerReducer from "./Stickers/Stickers.slice";
import textReducer from "./Text/Text.slice";
import shapeReducer from "./Shapes/Shape.slice";


const reducer = combineReducers(
    {
        video: videoReducer,
        image: imageReducer,
        sticker: stickerReducer,
        text: textReducer,
        shapes: shapeReducer
    }
)

export default reducer;
