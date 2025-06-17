import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x: number;
  y: number;
}

interface TextItem {
  id: string;
  content: string;
  type: 'heading' | 'subheading' | 'body';
  position: Position;
  style: {
    fontSize: number;
    color: string;
    fontWeight: string;
  };
  isEditing: boolean;
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
      const newText = {
        ...action.payload,
        id: Date.now().toString(),
        isEditing: false
      };
      state.texts.push(newText);
    },
    updateTextContent: (state, action: PayloadAction<{ id: string, content: string }>) => {
      const index = state.texts.findIndex(text => text.id === action.payload.id);
      if (index !== -1) {
        state.texts[index].content = action.payload.content;
      }
    },
    updateTextPosition: (state, action: PayloadAction<{ id: string, position: Position }>) => {
      const index = state.texts.findIndex(text => text.id === action.payload.id);
      if (index !== -1) {
        state.texts[index].position = action.payload.position;
      }
    },
    setEditing: (state, action: PayloadAction<{ id: string, isEditing: boolean }>) => {
      const index = state.texts.findIndex(text => text.id === action.payload.id);
      if (index !== -1) {
        state.texts[index].isEditing = action.payload.isEditing;
      }
    },
    deleteText: (state, action: PayloadAction<string>) => {
      state.texts = state.texts.filter(text => text.id !== action.payload);
    },
  },
});

export const { addText, updateTextContent, updateTextPosition, setEditing, deleteText } = textSlice.actions;
export default textSlice.reducer;