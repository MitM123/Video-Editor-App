import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface StickerItem {
    id: string;
    emoji: string;
    position: { x: number; y: number };
    size: number;
}

interface StickerState {
    stickers: StickerItem[];
}

const initialState: StickerState = {
    stickers: [],
};

const stickerSlice = createSlice({
    name: 'sticker',
    initialState,
    reducers: {
        addSticker: (state, action: PayloadAction<StickerItem>) => {
            state.stickers.push(action.payload);
        },
        deleteSticker: (state, action: PayloadAction<string>) => {
            state.stickers = state.stickers.filter(sticker => sticker.id !== action.payload);
        },
        updateStickerPosition: (state, action: PayloadAction<{ id: string, position: { x: number, y: number } }>) => {
            const index = state.stickers.findIndex(sticker => sticker.id === action.payload.id);
            if (index !== -1) {
                state.stickers[index].position = action.payload.position;
            }
        },
        updateStickerSize: (state, action: PayloadAction<{ id: string, size: number }>) => {
            const index = state.stickers.findIndex(sticker => sticker.id === action.payload.id);
            if (index !== -1) {
                state.stickers[index].size = action.payload.size;
            }
        },
    },
});

export const { addSticker, deleteSticker, updateStickerPosition, updateStickerSize } = stickerSlice.actions;
export default stickerSlice.reducer;