// Slices/Image.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ImageItem {
  id: number;
  url: string;
  name: string;
  position: { x: number; y: number };
  appliedFilter?: string;
}

interface ImageState {
  uploadedImages: ImageItem[];
}

const initialState: ImageState = {
  uploadedImages: [],
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<ImageItem>) => {
      state.uploadedImages.push(action.payload);
    },
    deleteImage: (state, action: PayloadAction<number>) => {
      state.uploadedImages = state.uploadedImages.filter(img => img.id !== action.payload);
    },
    updateImagePosition: (state, action: PayloadAction<{ id: number, position: { x: number, y: number } }>) => {
      const index = state.uploadedImages.findIndex(img => img.id === action.payload.id);
      if (index !== -1) {
        state.uploadedImages[index].position = action.payload.position;
      }
    },
    setImageFilter: (state, action: PayloadAction<{ id: number, filter: string }>) => {
      const index = state.uploadedImages.findIndex(img => img.id === action.payload.id);
      if (index !== -1) {
        state.uploadedImages[index].appliedFilter = action.payload.filter;
      }
    },
  },
});

export const { addImage, deleteImage, updateImagePosition, setImageFilter } = imageSlice.actions;
export default imageSlice.reducer;