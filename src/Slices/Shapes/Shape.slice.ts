import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import undoable from 'redux-undo';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ShapeItem {
  id: string;
  type: 'blob' | 'wave' | 'corner' | 'swirl';
  position: Position;
  size: Size;
  color: string;
  zIndex: number;
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
      const newShape = {
        ...action.payload,
        id: Date.now().toString(),
        zIndex: state.shapes.length + 1
      };
      state.shapes.push(newShape);
    },
    updateShapePosition: (state, action: PayloadAction<{ id: string, position: Position }>) => {
      const index = state.shapes.findIndex(shape => shape.id === action.payload.id);
      if (index !== -1) {
        state.shapes[index].position = action.payload.position;
      }
    },
    updateShapeSize: (state, action: PayloadAction<{ id: string, size: Size }>) => {
      const index = state.shapes.findIndex(shape => shape.id === action.payload.id);
      if (index !== -1) {
        state.shapes[index].size = action.payload.size;
      }
    },
    deleteShape: (state, action: PayloadAction<string>) => {
      state.shapes = state.shapes.filter(shape => shape.id !== action.payload);
    },
    bringShapeToFront: (state, action: PayloadAction<string>) => {
      const maxZIndex = Math.max(...state.shapes.map(shape => shape.zIndex), 0);
      const index = state.shapes.findIndex(shape => shape.id === action.payload);
      if (index !== -1) {
        state.shapes[index].zIndex = maxZIndex + 1;
      }
    },
  },
});

export const { addShape, updateShapePosition, updateShapeSize, deleteShape, bringShapeToFront } = shapeSlice.actions;
export default undoable(shapeSlice.reducer, { limit: 10 });

