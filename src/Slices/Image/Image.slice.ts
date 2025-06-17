import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ImageItem {
  id: number;
  url: string;
  name: string;
  position: Position;
  size: Size;
  appliedFilter?: string;
  appliedEffect?: string;
  zIndex: number;
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
      const newImage = {
        ...action.payload,
        zIndex: state.uploadedImages.length + 1
      };
      state.uploadedImages.push(newImage);
    },
    deleteImage: (state, action: PayloadAction<number>) => {
      state.uploadedImages = state.uploadedImages.filter(img => img.id !== action.payload);
    },
    updateImagePosition: (state, action: PayloadAction<{ id: number, position: Position }>) => {
      const index = state.uploadedImages.findIndex(img => img.id === action.payload.id);
      if (index !== -1) {
        state.uploadedImages[index].position = action.payload.position;
      }
    },
    updateImageSize: (state, action: PayloadAction<{ id: number, size: Size }>) => {
      const index = state.uploadedImages.findIndex(img => img.id === action.payload.id);
      if (index !== -1) {
        state.uploadedImages[index].size = action.payload.size;
      }
    },
    bringImageToFront: (state, action: PayloadAction<number>) => {
      const maxZIndex = Math.max(...state.uploadedImages.map(img => img.zIndex), 0);
      const index = state.uploadedImages.findIndex(img => img.id === action.payload);
      if (index !== -1) {
        state.uploadedImages[index].zIndex = maxZIndex + 1;
      }
    },
  },
});

export const { addImage, deleteImage, updateImagePosition, updateImageSize, bringImageToFront } = imageSlice.actions;
export default imageSlice.reducer;