import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

interface ShapeItem {
  id: string;
  type: 'blob' | 'wave' | 'corner' | 'swirl';
  position: { x: number; y: number };
  size: number;
  color: string;
}

interface ShapeState {
  shapes: ShapeItem[];
}

const initialState: ShapeState = {
  shapes: [],
};

const shapeSlice = createSlice({
  name: 'shape',
  initialState,
  reducers: {
    addShape: (state, action: PayloadAction<ShapeItem>) => {
      state.shapes.push(action.payload);
    },
    updateShapePosition: (state, action: PayloadAction<{id: string, position: {x: number, y: number}}>) => {
      const index = state.shapes.findIndex(shape => shape.id === action.payload.id);
      if (index !== -1) {
        state.shapes[index].position = action.payload.position;
      }
    },
    updateShapeSize: (state, action: PayloadAction<{id: string, size: number}>) => {
      const index = state.shapes.findIndex(shape => shape.id === action.payload.id);
      if (index !== -1) {
        state.shapes[index].size = action.payload.size;
      }
    },
    deleteShape: (state, action: PayloadAction<string>) => {
      state.shapes = state.shapes.filter(shape => shape.id !== action.payload);
    },
  },
});

export const { addShape, updateShapePosition, updateShapeSize, deleteShape } = shapeSlice.actions;
export default shapeSlice.reducer;