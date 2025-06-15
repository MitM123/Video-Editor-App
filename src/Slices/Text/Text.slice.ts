import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TextItem {
    id: string;
    content: string;
    type: 'heading' | 'subheading' | 'body';
    position: { x: number; y: number };
    style: {
        fontSize: number;
        color: string;
        fontWeight: string;
    };
}

interface TextState {
    texts: TextItem[];
}

const initialState: TextState = {
    texts: [],
};

const textSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        addText: (state, action: PayloadAction<TextItem>) => {
            state.texts.push(action.payload);
        },
        updateTextContent: (state, action: PayloadAction<{ id: string, content: string }>) => {
            const index = state.texts.findIndex(text => text.id === action.payload.id);
            if (index !== -1) {
                state.texts[index].content = action.payload.content;
            }
        },
        updateTextPosition: (state, action: PayloadAction<{ id: string, position: { x: number, y: number } }>) => {
            const index = state.texts.findIndex(text => text.id === action.payload.id);
            if (index !== -1) {
                state.texts[index].position = action.payload.position;
            }
        },
        updateTextStyle: (state, action: PayloadAction<{ id: string, style: Partial<TextItem['style']> }>) => {
            const index = state.texts.findIndex(text => text.id === action.payload.id);
            if (index !== -1) {
                state.texts[index].style = {
                    ...state.texts[index].style,
                    ...action.payload.style
                };
            }
        },
        deleteText: (state, action: PayloadAction<string>) => {
            state.texts = state.texts.filter(text => text.id !== action.payload);
        },
    },
});

export const { addText, updateTextContent, updateTextPosition, updateTextStyle, deleteText } = textSlice.actions;
export default textSlice.reducer;   